export class Tree {
  private static _childrenForParent: Map<Tree, Set<Tree>> = new Map();
  private static _parentForChild: Map<Tree, Tree> = new Map();

  constructor() {
    Tree._childrenForParent.set(this, new Set());
    Tree._parentForChild.set(this, this);
  }

  public connected(tree: Tree): boolean {
    return Tree._parentForChild.get(this) === Tree._parentForChild.get(tree);
  }

  public connect(tree: Tree): void {
    const newParent = Tree._parentForChild.get(this)!;
    const treeParent = Tree._parentForChild.get(tree)!;

    Tree._childrenForParent.get(newParent)?.add(treeParent);

    const children = Tree._childrenForParent.get(treeParent)!;
    children.forEach((child) => {
      Tree._childrenForParent.get(newParent)?.add(child);
    });
    Tree._childrenForParent.set(treeParent, new Set()); // !!

    Tree._childrenForParent.get(newParent)?.forEach((child) => {
      Tree._parentForChild.set(child, newParent);
    });
  }
}
