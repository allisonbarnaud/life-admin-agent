import { withEve } from "eve/next";
import { withWorkflow } from "workflow/next";

/** @type {import('next').NextConfig} */
const nextConfig = {};

// Eve mounts /eve/v1/* (durable agent). withWorkflow enables raw "use workflow"
// labs under workflows/ so you can learn the primitive Eve sits on.
export default withEve(withWorkflow(nextConfig));
