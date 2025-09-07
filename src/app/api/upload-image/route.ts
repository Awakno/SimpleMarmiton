import {
  IncomingForm,
  File as FormidableFile,
  Fields,
  Files,
} from "formidable";
import { v2 as cloudinary } from "cloudinary";
import { IncomingMessage } from "http";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: "daehxr1vw",
  api_key: "857261785677313",
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request): Promise<Response> {
  return await new Promise((resolve) => {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      resolve(
        new Response(JSON.stringify({ error: "Invalid content-type" }), {
          status: 400,
        })
      );
      return;
    }
    req.arrayBuffer().then((ab) => {
      const bodyBuffer = Buffer.from(ab);
      const nodeReq = nodeRequestFromWeb(req, bodyBuffer);
      const form = new IncomingForm();
      form.parse(nodeReq, async (err: any, fields: Fields, files: Files) => {
        if (err) {
          resolve(
            new Response(JSON.stringify({ error: "Form parse error" }), {
              status: 500,
            })
          );
          return;
        }
        const file = files.file as
          | FormidableFile
          | FormidableFile[]
          | undefined;
        if (!file) {
          resolve(
            new Response(JSON.stringify({ error: "No file uploaded" }), {
              status: 400,
            })
          );
          return;
        }
        try {
          const filePath = Array.isArray(file)
            ? file[0].filepath
            : file.filepath;
          const result = await cloudinary.uploader.upload(filePath, {
            folder: "marmiton",
          });
          resolve(
            new Response(JSON.stringify({ url: result.secure_url }), {
              status: 200,
            })
          );
        } catch (e) {
          resolve(
            new Response(
              JSON.stringify({ error: "Cloudinary upload failed" }),
              { status: 500 }
            )
          );
        }
      });
    });
  });
}

function nodeRequestFromWeb(req: Request, bodyBuffer: Buffer) {
  const nodeReq = new Readable() as any;
  nodeReq._read = () => {};
  nodeReq.push(bodyBuffer);
  nodeReq.push(null);

  // Add IncomingMessage properties
  nodeReq.headers = Object.fromEntries(req.headers.entries());
  nodeReq.method = req.method;
  nodeReq.url = "";
  nodeReq.httpVersion = "1.1";
  nodeReq.httpVersionMajor = 1;
  nodeReq.httpVersionMinor = 1;
  nodeReq.aborted = false;
  nodeReq.complete = true;
  nodeReq.socket = null;
  nodeReq.connection = null;
  nodeReq.statusCode = null;
  nodeReq.statusMessage = null;
  nodeReq.rawHeaders = [];
  nodeReq.rawTrailers = [];
  nodeReq.trailers = {};

  return nodeReq as IncomingMessage;
}
