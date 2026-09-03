/** Federated modules have no types at build time — declare what you consume. */
declare module 'todo/TodoApp' {
  const TodoApp: React.ComponentType;
  export default TodoApp;
}
