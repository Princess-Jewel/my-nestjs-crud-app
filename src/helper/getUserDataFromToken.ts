// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import { handleJwtVerificationError } from 'src/errorHandlers/handleJwtVerificationError';

// interface DecodedToken {
//   userId: number;
//   email: string;
// }

// export function getUserDataFromToken(req: Request, res: Response): DecodedToken | null {
//   const token = req.headers.authorization;

//   if (token && token.startsWith('Bearer ')) {
//     const authToken = token.slice(7);

//     console.log("authTokne:", authToken)

//     try {
//       const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
      
// console.log("decoded:", decoded)
//       if (typeof decoded === 'string') {
//         handleJwtVerificationError(res, decoded);
//         return null;
//       }

//       return decoded as DecodedToken;
//     } catch (error) {
//       console.error('JWT verification failed:', error.message);
//       return null;
//     }
//   }

//   return null;
// }
