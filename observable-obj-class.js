// using obj
const obsObj = observable({
  itemA:'',
  itemB:'',
  search:action(()=>{
    // some action
  })
});


class obsClass {
  @observable itemA = '';
  @observable itemB = '';

  @action.bound
  search(value) {
    return itemA == value;
  }
}