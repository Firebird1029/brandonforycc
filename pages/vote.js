import { useState, useEffect } from "react";
import Head from "next/head";

import { initializeApp } from "firebase/app";
import { getFirestore, increment } from "firebase/firestore";

import { collection, doc, query, where, getDoc, getDocs, updateDoc } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyBMgnO7Xpsi2xZf6RFFD-cVziINmydCxfc",
	authDomain: "ycc-events-race-2023.firebaseapp.com",
	projectId: "ycc-events-race-2023",
	storageBucket: "ycc-events-race-2023.appspot.com",
	messagingSenderId: "518775451160",
	appId: "1:518775451160:web:b07fe9e0dca0dcdad8dd6d",
	measurementId: "G-DH4723LM6P",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// async function addFirebaseDoc() {
// 	console.log("adding doc");
// 	try {
// 		const docRef = await addDoc(collection(db, "posts_v1"), {
// 			post: "test",
// 			enabled: 0,
// 			timestamp: new Date(),
// 		});
// 		console.log("Document written with ID: ", docRef.id);
// 	} catch (e) {
// 		console.error("Error adding document: ", e);
// 	}
// }

const YES_TEXT = "Yes — I would like my idea to be displayed, along with my name, for people to upvote.";

async function getPosts() {
	const q = query(collection(db, "posts_v1"), where("show", "==", "1"), where("usershow", "==", YES_TEXT));

	const lsdata = JSON.parse(localStorage.getItem("brandonforycc_v1"));

	const querySnapshot = await getDocs(q);
	let posts = [];
	querySnapshot.forEach((doc) => {
		// doc.data() is never undefined for query doc snapshots
		// console.log(doc.id, " => ", doc.data());
		posts.push({ id: doc.id, ...doc.data(), ls_upvoted: lsdata ? lsdata.includes(doc.id) : false });
	});
	return posts;
}

function suggestedBy(email) {
	console.log(email);
	if ((email.match(/\./g) || []).length < 2) {
		return "Anonymous";
	}
	let fname = email.split(".")[0];
	return fname.charAt(0).toUpperCase() + fname.slice(1);
}

export default function Vote() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		getPosts().then((posts) => {
			setPosts(posts);
			console.log(posts);
		});
	}, []);

	async function upvote(id) {
		let lsdata = JSON.parse(localStorage.getItem("brandonforycc_v1"));
		if (lsdata && lsdata.includes(id)) {
			return;
		}

		const postRef = doc(db, "posts_v1", id);

		await updateDoc(postRef, {
			upvotes: increment(1),
		});

		// Local Storage

		if (!lsdata) {
			lsdata = [id];
		} else {
			lsdata.push(id);
		}
		localStorage.setItem("brandonforycc_v1", JSON.stringify(lsdata));

		// Refresh
		getPosts().then((posts) => {
			setPosts(posts);
			console.log(posts);
		});
	}

	return (
		<>
			<Head>
				<title>Brandon Yee for YCC</title>
				<meta name="description" content="Brandon Yee for YCC" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex, nofollow" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main style={{ backgroundColor: "white" }}>
				<section className="section">
					<div className="container">
						{posts.length > 0 &&
							posts.map(({ id, post, upvotes, email, ls_upvoted }) => (
								<div key={id} className={`box ${ls_upvoted ? "has-background-success-light" : ""}`}>
									<div className="level mb-1">
										<div className="level-left">{post}</div>
										<div className="level-right">
											{!ls_upvoted && (
												<button className="button is-success" onClick={() => upvote(id)}>
													Upvote
												</button>
											)}
										</div>
									</div>
									<p className="is-size-7 has-text-weight-light">
										{upvotes || "0"} likes, suggested by {suggestedBy(email)}
									</p>
								</div>
							))}
					</div>
				</section>
			</main>
		</>
	);
}
