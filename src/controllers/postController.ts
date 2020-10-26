import axios, { AxiosResponse } from "axios";
import { timing } from "../util/timingUtil";

export default class PostController {
  private jsonApi: string;
  constructor(api?: string) {
    this.jsonApi = api || `https://jsonplaceholder.typicode.com/posts`;
  }

  @timing()
  async getPosts(): Promise<AxiosResponse> {
    const result = await axios.get(this.jsonApi);

    return result;
  }

  @timing()
  async createPost(title: string, body: string): Promise<AxiosResponse> {
    // simulating param check
    function sleep(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }

    await sleep(2000);
    const result = await axios.post(this.jsonApi, {
      title,
      body,
      userId: 1,
    });

    return result;
  }

  @timing()
  async updatePost(postId: number, title: string): Promise<AxiosResponse> {
    const result = await axios.patch(`${this.jsonApi}/${postId}`, {
      title,
    });

    return result;
  }

  @timing()
  async deletePost(postId: number): Promise<AxiosResponse> {
    const result = await axios.delete(`${this.jsonApi}/${postId}}`);

    return result;
  }
}
