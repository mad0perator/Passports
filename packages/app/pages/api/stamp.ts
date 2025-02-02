import { initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";
import { firebaseConfig } from "../../components/constants";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      const { address, contract, chain, token } = req.body;
      const app = initializeApp(firebaseConfig);
      const db = getFirestore(app);
      const urlCol = collection(db, "stamps");
      const contractDoc = doc(urlCol);
      return setDoc(contractDoc, {
        address: address.toLowerCase(),
        contract: contract.toLowerCase(),
        chain: Number(chain),
        token: Number(token),
      })
        .then(() => {
          res.status(200).json({ success: true });
        })
        .catch((e) => {
          res.status(500).json({ message: e.message });
        });
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
