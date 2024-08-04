"use client";
import {
  Box,
  Button,
  Modal,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import { firestore } from "@/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  query,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "white",
  border: "2px solid #000",
  boxShadow: "24",
  p: 4,
  gap: 3,
  display: "flex",
  flexDirection: "column",
};

export default function Home() {
  const [pantry, setPantry] = useState([]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [itemName, setItemName] = useState("");
  const [inputValues, setInputValues] = useState({});
  const [updatingItem, setUpdatingItem] = useState(null);

  const updatePantry = async () => {
    const snapshot = query(collection(firestore, "pantry"));
    const docs = await getDocs(snapshot);
    const pantryList = [];
    docs.forEach((doc) => {
      pantryList.push({ name: doc.id, ...doc.data() });
    });
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    //check
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();

      await setDoc(docRef, { count: count + 1 });
    } else {
      await setDoc(docRef, { count: 1 });
    }
    await updatePantry();
  };
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "pantry"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { count } = docSnap.data();

      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 });
      }
    }
    await updatePantry();
  };

  const handleInputChange = (e) => {
    setInputValues({
      ...inputValues,
      [updatingItem]: e.target.value,
    });
  };
  const updateItem = async (itemName) => {
    const newCount = parseInt(inputValues[itemName], 10);
    if (!isNaN(newCount) && newCount >= 0) {
      const docRef = doc(collection(firestore, "pantry"), itemName);
      if (newCount === 0) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: newCount });
      }
      await updatePantry();
      setUpdatingItem(null);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
      padding={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title " variant="h5" component={"h2"}>
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>
        Add
      </Button>
      <Box border={"1px solid #333"} width="100%" maxWidth={"800px"}>
        <Box
          width={"100%"}
          height={"100px"}
          bgcolor={"#ADD8E6"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Typography variant="h2" color={"#333"} textAlign={"center"}>
            Pantry Items
          </Typography>
        </Box>
        <Stack width="100%" height="300px" spacing={2} overflow={"auto"}>
          {pantry.map(({ name, count }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display={"flex"}
              flexDirection={{ xs: "column", sm: "row", md: "row" }}
              justifyContent={"space-between"}
              paddingX={2}
              alignItems={"center"}
              bgcolor={"#f0f0f0"}
            >
              <Typography variant="h5" color={"#333"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h5" color={"#333"} textAlign={"center"}>
                Quantity:{count}
              </Typography>
              {updatingItem === name ? (
                <>
                  <TextField
                    type="number"
                    value={inputValues[name] || ""}
                    onChange={handleInputChange}
                    placeholder="Update quantity"
                    inputProps={{ min: 0 }} // Set minimum value to 0
                  />
                  <Button variant="contained" onClick={() => updateItem(name)}>
                    Update
                  </Button>
                </>
              ) : (
                <>
                  <Stack direction={"row"} spacing={2}>
                    <Button variant="outlined" onClick={() => addItem(name)}>
                      ➕
                    </Button>
                    <Button variant="outlined" onClick={() => removeItem(name)}>
                      ➖
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => setUpdatingItem(name)}
                    >
                      Update
                    </Button>
                  </Stack>
                </>
              )}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
