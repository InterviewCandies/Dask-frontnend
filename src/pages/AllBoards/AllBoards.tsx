import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { BeatLoader, FadeLoader } from "react-spinners";
import { fetchBoardsByEmail } from "../../api/board";
import Card from "../../components/Card/Card";
import Layout from "../../components/common/Layout/Layout";
import NewBoard from "../../container/NewBoard/NewBoard";
import { useDialog } from "../../provider/DialogProvider";
import { useLoading } from "../../provider/LoaderProvider";
import { StateTypes, User } from "../../types";
import Empty from "../../assets/img/empty.png";

const DEFAULT_COLOR = "#001eb3";

const AllBoards: React.FC = () => {
  const { email } = useSelector((state: StateTypes) => state.user);
  const boards = useSelector((state: StateTypes) => state.boards);
  const history = useHistory();
  const [openDialog] = useDialog();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const result = await dispatch(fetchBoardsByEmail(email));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);
  return (
    <Layout>
      <div className="container mx-auto  lg:px-30 xl:px-40 md:px-10 px-5">
        <div className="flex justify-between items-center pt-10 pb-5">
          <h1 className="font-semibold tracking-wider text-lg">All Boards</h1>
          <button
            className="px-4 py-2  p-2 bg-blue-500 rounded-lg text-white focus:outline-none  font-semibold hover:bg-blue-300"
            onClick={() =>
              openDialog({
                children: <NewBoard></NewBoard>,
              })
            }
          >
            <i className="fas fa-plus"></i> Add
          </button>
        </div>
        {loading ? (
          <div className="flex flex-col mt-32 justify-center items-center">
            <BeatLoader color={DEFAULT_COLOR}></BeatLoader>
            <h1>Loading boards...</h1>
          </div>
        ) : (
          <>
            {boards.length === 0 ? (
              <div className="flex space-y-4 flex-col justify-center items-center h-full">
                <img src={Empty}></img>
                <h1
                  className="text-6xl font-extrabold text-blue-50"
                  style={{ color: DEFAULT_COLOR }}
                >
                  Empty
                </h1>{" "}
                <h1 className="font-bold">
                  Start to create your own board now
                </h1>
              </div>
            ) : (
              <div className="px-8 sm:px-0 grid  grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                {boards.map((board) => (
                  <Card
                    key={board._id}
                    board={board}
                    onClick={() => {
                      const isMember =
                        (board.members as User[]).findIndex(
                          (member) => member.email === email
                        ) >= 0;
                      if (isMember) history.push("/board/" + board._id);
                      else
                        enqueueSnackbar(
                          "You do not have access to this board",
                          {
                            variant: "error",
                          }
                        );
                    }}
                  ></Card>
                ))}
              </div>
            )}{" "}
          </>
        )}
      </div>
    </Layout>
  );
};

export default AllBoards;
