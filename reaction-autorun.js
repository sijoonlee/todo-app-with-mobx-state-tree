class Cart{
  @observable noItems;
  totalPrice;

  cancelReaction = null;

  trackerForNoItems(){
    if(this.cancelTracker)
      this.cancelTracker();
    
    this.cancelReaction = reaction(
      // recognize the change in return value of tracker-function
      // only when there is a change, will call effect-function
      () => { // tracker-function
        if(this.noItems > 3)
          return 8;
        if(this.noItems > 2)
          return 9;
        else
          return 10;
      },
      (pricePerItem) => { // effect-function
        this.totalPrice = pricePerItem * this.noItems;
        console.log("reaction");
        console.log("Price per item ", pricePerItem);
      }
    )
  }
  constructor()
  {
    this.noItems = 0;
    this.totalPrice = 0;
    autorun(()=>{
      console.log("autorun");
      console.log(this.noItems);
    })
  }
  @computed get desc(){
    if (this.noItems > 0)
      return "You have items";
    else
      return "Nope, you don't";
  }
  @action addOne = () => {
    this.noItems++;
  }
  
}


const myCart = new Cart();

myCart.trackerForNoItems();

myCart.addOne();

myCart.addOne();

myCart.noItems += 1;

myCart.noItems += 1;

myCart.noItems += 1;

myCart.noItems += 1;