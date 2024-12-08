import { root_api } from "@/app/_utils/apis";
import { IDraft } from "../_types";

const getDraft = async (uuid: string): Promise<IDraft> => {
  const { data } = await root_api.get(`/draft/${uuid}`);
  return data.draft as IDraft;
};

export default getDraft;
