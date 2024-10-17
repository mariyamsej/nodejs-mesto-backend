// import express from 'express';

// declare global {
//   namespace Express {
//     interface Request {
//       user?: Record<string,any>
//     }
//   }
// }

import { ObjectId} from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user: { _id: string }
    }
  }
}