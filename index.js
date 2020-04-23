import { types, getSnapshot, onSnapshot, onPatch, onAction, addMiddleware } from "mobx-state-tree";
import { render } from "react-dom";
import { observer } from "mobx-react";
import { observable, computed, values, autorun, action, reaction } from "mobx";
import React, {useRef} from "react";


// const Todo = types.model({
//   name: "",
//   done: false
// })

// const User = types.model({
//   name:""
// })

// const john = User.create({name:"John"});
// const eat = Todo.create({name:"Eat", done:false});

// console.log("John ", getSnapshot(john));
// console.log("Eat ", getSnapshot(eat));

const randomId = () => Math.floor(Math.random()*1000).toString(36);

const Todo = types
  .model({
    name: types.optional(types.string, ""),
    done: types.optional(types.boolean, false)
  })
  .actions(self => ({
    setName(newName) {
      self.name = newName
    },

    toggle() {
      self.done = !self.done
    }
  }))

const User = types.model({
  name: types.optional(types.string, "")
})

const RootStore = types
    .model({
        users: types.map(User),
        todos: types.map(Todo)
    })
    .views(self => ({
        get taskNames() { // computed
          return values(self.todos).map(todo=>todo.name)
        },
        get pendingCount() { // computed
          return values(self.todos).filter(todo => !todo.done).length
        },
        get completedCount() { // computed
          return values(self.todos).filter(todo => todo.done).length
        },
        getTodosWhereDoneIs(done){ // nope
          return values(self.todos).filter(todo=>todo.done === done);
        }
    }))
    .actions(self => ({
        addUser(id, name) {
          self.users.set(id, User.create({ name }));
        },
        addTodo(id, name) {
          self.todos.set(id, Todo.create({ name }));
        }
    }))

const store = RootStore.create({
  users: {} // users is not required really since arrays and maps are optional by default since MST3
})

// const TodoTaskNameView = observer(props => {
//   console.log(props.taskNames);
//   return (
//     <div>
//       {props.taskNames.map(name =>
//         <p>{name}</p>
//       )}
//     </div>
//   )
// })

const TodoCounterView = observer(props => (
  <div>
      {props.store.pendingCount} pending, {props.store.completedCount} completed
  </div>
))

const TodoView = observer(props => 
  <div>
    <input
      type="checkbox"
      checked={ props.todo.done }
      onChange={ e => props.todo.toggle() }
    />
    <input
      type="text"
      value={props.todo.name}
      onChange={ e=> props.todo.setName(e.target.value)}
    />
  </div>
)

const AppView = observer( props => {
    const taskName = useRef(null);
    // props.store.taskNames.map(taskName => {
    //     console.log(taskName);
    //   }
    // );
    // props.store.getTodosWhereDoneIs(true).map(taskDone => {
    //     console.log(taskDone.name + " is done!");
    //   }
    // );
    return (
      <div>
        <input ref={taskName}/>
        <button onClick={e => props.store.addTodo(randomId(), taskName.current.value)}>Add Task</button>
        {values(props.store.todos).map(todo => (
              <TodoView todo={todo} />
        ))}
        <TodoCounterView store={props.store} />
      </div>
    )
  }
)


store.addTodo(1, "eating")
store.addTodo(2, "drinking")
onSnapshot(store, snapshot => {
  console.log("onSnapshot");
  console.log(snapshot)});
onPatch(store, patch => {
  console.log("onPatch");
  console.log(patch)});
onAction(store, call => {
  console.log("onAction")
  console.log(call)});
addMiddleware(store, (call, next) => {
  console.log("Middleware 1");
  call.args[0] = call.args[0] + '-';
  console.log(call);
  return next(call);
})
addMiddleware(store, (call, next) => {
  console.log("Middleware 2");
  call.args[0] = call.args[0] + '*';
  console.log(call);
  return next(call);
})
render(<AppView store={store}/>, document.getElementById("root"));