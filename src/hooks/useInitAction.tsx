// import { useStore } from "react-redux";
// import { RouteParams, InitAction } from "src/routes/typings";
// import { AppState } from "reducers/typings";

// const useInitAction = async (
//   selector: (state: AppState) => Partial<AppState>,
//   action: InitAction,
//   params: RouteParams = {}
// ) => {
//   const store = useStore();
//   const state: AppState = store.getState();

//   const result = selector(state);

//   if (!result) {
//     action(store.dispatch, params);
//   }
// };

// export default useInitAction;
