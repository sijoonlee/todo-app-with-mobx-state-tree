import { types, getSnapshot, onSnapshot, onPatch, onAction, addMiddleware } from "mobx-state-tree";
import { render } from "react-dom";
import { observer } from "mobx-react";
import { observable, computed, values, autorun, action, reaction, when } from "mobx";
import React, {useRef} from "react";

class Cart{
  @observable noItems;
  totalPrice;

  cancelAutorun = null;
  cancelReaction = null;
  cancelWhen = null;
  
  constructor()
  {
    this.noItems = 0;
    this.totalPrice = 0;
    // autorun
    this.cancelAutorun = autorun(()=>{
      console.log("autorun");
      console.log(this.noItems);
    });
  }

  tracker(){
    // reaction
    if(this.cancelReaction)
      this.cancelReaction();
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

    if(this.cancelWhen)
      this.cancelWhen();
    this.cancelWhen = when(
      () => { // predicate-function - returns true/false
        if (this.noItems === 5 || this.noItems == 7){
          console.log("when, predicate, true");
          return true
        }
        else{
          console.log("when, predicate, false");
          return false
        }  
      },
      () => { // effect-function - only executes when predicate-function returns true
        console.log("When");
        console.log("FIVE OR SEVEN");
      }
    )
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

myCart.tracker();

myCart.addOne(); // 1

myCart.addOne(); // 2

myCart.noItems += 1; // 3

myCart.noItems += 1; // 4

myCart.noItems += 1; // 5

myCart.noItems += 1; // 6

myCart.noItems += 1; // 7

myCart.noItems += 1; // 8

/*
reaction-autorun.js:47 autorun
reaction-autorun.js:48 0
reaction-autorun.js:78 when, predicate, false
reaction-autorun.js:47 autorun
reaction-autorun.js:48 1
reaction-autorun.js:78 when, predicate, false
reaction-autorun.js:47 autorun
reaction-autorun.js:48 2
reaction-autorun.js:78 when, predicate, false
reaction-autorun.js:47 autorun
reaction-autorun.js:48 3
reaction-autorun.js:68 reaction
reaction-autorun.js:69 Price per item  9
reaction-autorun.js:78 when, predicate, false
reaction-autorun.js:47 autorun
reaction-autorun.js:48 4
reaction-autorun.js:68 reaction
reaction-autorun.js:69 Price per item  8
reaction-autorun.js:78 when, predicate, false
reaction-autorun.js:47 autorun
reaction-autorun.js:48 5
reaction-autorun.js:75 when, predicate, true
reaction-autorun.js:83 When
reaction-autorun.js:84 FIVE OR SEVEN
reaction-autorun.js:47 autorun
reaction-autorun.js:48 6
reaction-autorun.js:47 autorun
reaction-autorun.js:48 7
reaction-autorun.js:47 autorun
reaction-autorun.js:48 8
*/