//DB 대용입니다. 나중에 배우면 사라질 것.
type Storage = {
  total: number;
  current: number;
  data: string[];
};

const storage: Storage = {
  total: 0,
  current: 0,
  data: [],
};

export default storage;
