export class JobCreateResponseDTO {
  constructor(
    public title: string,
    public description: string,
    public id: number
  ) {}
}

export class JobResponseDTO {
  constructor(
    public title: string,
    public description: string,
    public id: number,
    public createdAt: Date
  ) {}
}

export class JobListResponseDTO {
  constructor(public list: { title: string; id: number; createdAt: Date }[]) {
    this.list = list.map((job) => ({
      title: job.title,
      id: job.id,
      createdAt: job.createdAt,
    }));
  }
}

export class JobErrorResponseDTO {
  constructor(public message: string) {}
}
