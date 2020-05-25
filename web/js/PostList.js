class PostList {
  constructor(posts) {
    this._posts = [];
    for (const post of posts) {
      this.add(post);
    }
  }

  static validatePost(post) {
    if (!post) return false;
    if (!post.id || typeof post.id !== 'number') return false;
    if (!post.content || typeof post.content !== 'string') return false;
    if (!post.createdAt || typeof post.createdAt !== 'object') return false;
    if (!PostList._validateUser(post.author)) return false;

    if (post.imageUrl && typeof post.imageUrl !== 'string') return false;
    if (post.hashTags && post.hashTags.some(hashTag => typeof hashTag !== 'string')) return false;
    if (post.likes && !post.likes.every(user => PostList._validateUser(user))) return false;

    return true;
  }

  static _validateUser(user) {
    if (!user) return false;
    if (!user.id || typeof user.id !== 'number') return false;
    if (!user.name || typeof user.name !== 'string') return false;
    if (!user.surname || typeof user.surname !== 'string') return false;

    return true;
  }

  _filter(_posts, filterConfig) {
    if (!filterConfig) return this._posts;
    let posts = this._posts;
    const {date, authorId, hashTag} = filterConfig;
    if (authorId) {
      posts = posts.filter(post => post.author.id === authorId);
    }
    if (hashTag) {
      posts = posts.filter(post => post.hashTags.find(tag => tag === hashTag));
    }
    if (date) {
      if (date.before) {
        posts = posts.filter(post => post.createdAt <= date.before);
      } else if (date.after) {
        posts = posts.filter(post => post.createdAt >= date.after);
      } else {
        posts = posts.filter(post => post.createdAt === date);
      }
    }
    return posts;
  }

  add(post) {
    if (!PostList.validatePost(post)) return false;
    this._posts.push(post);
    return this._posts;
  }

  get(id) {
    return this._posts.find(post => post.id === id);
  }

  getPage(skip = 0, top = 10, filterConfig) {
    const paginated = this._posts.slice(skip, skip + top);
    const sorted = paginated.sort((a, b) => a.createdAt < b.createdAt);
    return this._filter(sorted, filterConfig);
  }


  edit(id, data) {
    const targetPost = this.get(id);
    const editedPost = {...targetPost, ...data};

    if (!PostList.validatePost(editedPost)) return false;
    const findIndex = this._posts.findIndex(post => post.id === id);
    this._posts[findIndex] = editedPost;
    return editedPost;
  }

  remove(id) {
    this._posts = this._posts.filter(post => post.id !== id);
    return this._posts;
  }

  clear() {
    this._posts = [];
  }
}