import axios from "axios";

import { IDraft } from "../_types";

const getDraft = async (token: string, uuid: string): Promise<IDraft> => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/draft/${uuid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const draft = data.draft as IDraft;
  return draft;
};

export default getDraft;
