class TreeNode {
  constructor(path) {
    this.path = path;
    this.children = [];
  }

  addChild(paths, newNode = null) {
    let index;
    const path = paths.shift();
    if (paths.length === 0) {
      index = this.children.findIndex((item) => item.path.localeCompare(path) === 1);
      if (index === -1) {
        index = this.children.length;
      }
      if (!newNode) {
        newNode = new TreeNode(path);
      }
      this.children.splice(index, 0, newNode);
    } else {
      index = this.children.findIndex((item) => item.path.localeCompare(path) === 0);
      if (index === -1) {
        throw `${path} does not exist`;
      }

      this.children[index].addChild(paths);
    }
  }

  removeChild(paths) {
    const path = paths.shift();
    const index = this.children.findIndex((item) => item.path.localeCompare(path) === 0);
    if (index === -1) {
      throw `${path} does not exist`;
    }

    if (paths.length > 0) {
      this.children[index].removeChild(paths);
    } else {
      this.children.splice(index, 1);
    }
  }

  findChild(paths) {
    const path = paths.shift();
    const index = this.children.findIndex((item) => item.path.localeCompare(path) === 0);
    if (index === -1) {
      throw `${path} does not exist`;
    }
    if (paths.length > 0) {
      return this.children[index].findChild(paths);
    }
    return [this, index];
  }

  show(prefix = '') {
    let newPrefix = prefix;
    if (this.path !== '') {
      console.log(prefix + this.path);
      newPrefix += '  ';
    }

    this.children.forEach((item) => item.show(newPrefix));
  }
}

AVAILABLE_COMMANDS = ['CREATE', 'DELETE', 'MOVE', 'LIST'];

class DirectoryTree {
  constructor() {
    this.root = new TreeNode('');
  }

  run(str) {
    const commands = (str || '').split(' ');

    if (!this._checkCommand(commands)) {
      return;
    }

    switch (commands[0].toUpperCase()) {
      case 'CREATE':
        this._create(commands[1]);
        break;
      case 'DELETE':
        this._delete(commands[1]);
        break;
      case 'MOVE':
        this._move(commands[1], commands[2]);
        break;
      case 'LIST':
        this._list();
        break;
    }
  }

  _create(path) {
    try {
      this.root.addChild(path.split('/'));
      console.log(`CREATE ${path}`);
    } catch (err) {
      console.log(`Cannot create ${path} - ${err}`);
    }
  }

  _delete(path) {
    try {
      this.root.removeChild(path.split('/'));
      console.log(`DELETE ${path}`);
    } catch (err) {
      console.log(`Cannot delete ${path} - ${err}`);
    }
  }

  _move(path1, path2) {
    try {
      const [parent1, parent1ChildIndex] = this.root.findChild(path1.split('/'));
      const [parent2, parent2ChildIndex] = this.root.findChild(path2.split('/'));
      const [oldNode] = parent1.children.splice(parent1ChildIndex, 1);
      parent2.children[parent2ChildIndex].addChild([oldNode.path], oldNode);
      console.log(`MOVE ${path1} ${path2}`);
    } catch (err) {
      console.log(`Cannot move from ${path1} to ${path2} - ${err}`);
    }
  }

  _list() {
    console.log('LIST');
    this.root.show();
  }

  _checkCommand(parts) {
    try {
      if (parts.length === 0) {
        throw 'Invalid command';
      }
      const command = parts[0].toUpperCase();
      if (
        !AVAILABLE_COMMANDS.includes(command) ||
        ((command === 'CREATE' || command === 'DELETE') && parts.length < 2) ||
        (command === 'MOVE' && parts.length < 3)
      ) {
        throw 'Invalid command';
      }
      return true;
    } catch (err) {
      console.log(err);
    }
    return false;
  }
}

// Define dirs
const dirs = new DirectoryTree();

dirs.run('CREATE fruits');
dirs.run('CREATE vegetables');
dirs.run('CREATE grains');
dirs.run('CREATE fruits/apples');
dirs.run('CREATE fruits/apples/fuji');
dirs.run('LIST');
dirs.run('CREATE grains/squash');
dirs.run('MOVE grains/squash vegetables');
dirs.run('CREATE foods');
dirs.run('MOVE grains foods');
dirs.run('MOVE fruits foods');
dirs.run('MOVE vegetables foods');
dirs.run('LIST');
dirs.run('DELETE fruits/apples');
dirs.run('DELETE foods/fruits/apples');
dirs.run('LIST');
