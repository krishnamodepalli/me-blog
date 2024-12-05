import { root_api } from "@/app/_utils/apis";
import { IDraft } from "../_types";

const getDraft = async (uuid: string): Promise<IDraft> => {
  const { data } = await root_api.get(`/draft/${uuid}`);
  const draft = data.draft as IDraft;
  return draft;
};

export default getDraft;
