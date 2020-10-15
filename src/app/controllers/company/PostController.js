import * as Yup from 'yup';
import Post from '../../models/Post';
import File from '../../models/File';
import Employee from '../../models/Employee';

import clearJunk from '../../../utils/clearJunk';

class PostController {
  async create(request, response) {
    const schema = Yup.object().shape({
      title: Yup.string(),
    });

    if (!(await schema.isValid(request.body))) {
      return response.status(400).json({ error: 'Validation fails.' });
    }

    const { title } = request.body;
    const midia = request.file;

    if (
      request.headers['content-type'].split(';')[0] !== 'multipart/form-data'
    ) {
      clearJunk(midia.filename);
      return response
        .status(400)
        .json({ error: 'Content type must be multipart/form-data' });
    }

    if (!midia && !title) {
      return response.status(400).json({ error: 'No content provided' });
    }

    let post;
    let midiaFile = {};
    try {
      if (midia) {
        midiaFile = await File.create({
          name: midia.originalname,
          path: midia.filename,
        });
      }
      post = await Post.create({
        employee_id: request.userId,
        title,
        midia_id: midiaFile.id || null,
      });
    } catch (err) {
      if (midia) {
        clearJunk(midia.filename);
      }

      return response.status(501).json({ error: 'Internal error.' });
    }

    const postPopulated = await Post.findByPk(post.id, {
      include: [
        {
          model: File,
          as: 'midia',
          attributes: ['url', 'path'],
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    });

    await postPopulated.getCommentsAndLikes(postPopulated.id);

    return response.json(postPopulated);
  }

  async index(request, response) {
    const { page = 1, order = 'newest', u } = request.query;

    const orderBy = {
      newest: 'DESC',
      oldest: 'ASC',
    };

    if (!orderBy[order]) {
      return response.status(400).json({ error: 'Invalid order value.' });
    }
    let posts;
    const options = {
      limit: 25,
      offset: (page - 1) * 25,
      order: [['created_at', orderBy[order]]],
      include: [
        {
          model: File,
          as: 'midia',
          attributes: ['url', 'path'],
        },
        {
          model: Employee,
          as: 'employee',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['url', 'path'],
            },
          ],
        },
      ],
    };
    try {
      if (u) {
        posts = await Post.findAll({
          where: { employee_id: u },
          ...options,
        });
      } else {
        posts = await Post.findAll({
          ...options,
        });
      }
    } catch (error) {
      return response.status(500).json({ error: 'Internal error.' });
    }

    await Promise.all(
      posts.map(async (post) => {
        await post.getCommentsAndLikes(post.id);
      })
    );

    return response.json(posts);
  }
}

export default new PostController();
