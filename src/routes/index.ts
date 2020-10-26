/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Router } from "express";
import PostController from "../controllers/postController";

// Init router and path
const router = Router();
const postController = new PostController();

router.get("/data", async (req, res) => {
  // Do middleware stuff
  const result = await postController.getPosts();

  res.json({
    status: 200,
    data: result.data,
  });
});

router.post("/data", async (req, res) => {
  const result = await postController.createPost(req.body.title, req.body.body);

  res.json({
    status: 200,
    data: result.data,
  });
});

router.put("/data", async (req, res) => {
  const result = await postController.updatePost(
    req.body.postId,
    req.body.title
  );

  res.json({
    status: 200,
    data: result.data,
  });
});

router.delete("/data", async (req, res) => {
  const result = await postController.deletePost(req.body.postId);

  res.json({
    status: 200,
    data: result.data,
  });
});

// Export the base-router
export default router;
