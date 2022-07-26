import "./FoodMenu.scss";
import React, { useState, useEffect } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { query, collection, getDocs, where } from "firebase/firestore";
import { auth, db, signInWithGoogle } from "./../../../DB/firebase-config";

function FoodMenu(props) {
  const [user, loading, error] = useAuthState(auth);

  const [menu, setMenu] = useState([]);

  const fetchUserName = async () => {
    setMenu([]);

    try {
      const foodMenu = collection(db, "foodMenu");
      const doc = await getDocs(foodMenu);
      // const data = doc.docs[0].data();
      // console.log(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setMenu(doc.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    } else {
      fetchUserName();
    }
  }, [user, loading]);

  const handlePickFood = (e) => {
    props.setFood(e);
    props.setIsOpen(false);
  };

  return (
    <div className="FoodMenu">
      <div className="Container">
        <div className="Food-Cards">
          {menu.map((menu) => (
            <div
              key={menu.id}
              onClick={() =>
                handlePickFood({
                  id: menu.id,
                  name: menu.name,
                  price: menu.price,
                  description: menu.description,
                })
              }
            >
              <img
                src="https://ph-web-bucket.s3.us-east-2.amazonaws.com/data/img/products/images/images/1648790214-My%20Box%20Xtra%20Slider.png"
                alt=""
              />
              <div className="name-price">
                <h5>{menu.name}</h5>
                <p>${menu.price}</p>
              </div>
              <p>{menu.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodMenu;
