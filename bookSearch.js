decorate(BookSearchStore, {
  term: observable,
  status: observable,
  results: observable.shallow,
  totalCount: observable,
  isEmpty: computed,
  setTerm: action.bound,
  search: action.bound,
  });