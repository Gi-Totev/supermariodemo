class EntityCollider {
  constructor(entities) {
    this.entities = entities;
  }

  check(subject) {
    this.entities.forEach((entity) => {
      if (subject === entity) return;
      if (subject.bounds.overlaps(entity.bounds)) {
        subject.collides(entity);
      }
    });
  }
}

export default EntityCollider;
