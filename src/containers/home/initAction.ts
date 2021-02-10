import { InitAction } from "typings/actions";
import HomeService from "services/home";
import { HomeProps } from "typings/home";
import { addHomeData } from "actions/home";

const initActionHome: InitAction = async dispatch => {
  const [section1, section2, section3] = await Promise.all([
    HomeService.fetchHomeSession1(dispatch).catch(err => {
      console.log("Home session1 Api error");
    }),
    HomeService.fetchHomeSession2(dispatch).catch(err => {
      console.log("Home session2 Api error");
    }),
    HomeService.fetchHomeSession3(dispatch).catch(err => {
      console.log("Home session3 Api error");
    })
  ]);
  const data: HomeProps = {
    section1: section1,
    section2: section2,
    section3: section3
  };
  dispatch(addHomeData({ ...data }));
};

export default initActionHome;
