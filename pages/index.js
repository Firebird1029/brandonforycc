import Head from "next/head";
import Image from "next/image";
// import styles from "@/styles/Home.module.css";

import { useState, useEffect, useRef } from "react";

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
	if ((email.match(/\./g) || []).length < 2) {
		return "Anonymous";
	}
	let fname = email.split(".")[0];
	return fname.charAt(0).toUpperCase() + fname.slice(1);
}

export default function Home() {
	const [posts, setPosts] = useState([]);
	const [searchPost, setSearchPost] = useState("");
	const [visiblePanels, setVisiblePanels] = useState([]);

	useEffect(() => {
		getPosts().then((posts) => {
			setPosts(posts);
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
		});
	}

	function handleSearch(e) {
		setSearchPost(e.target.value);
	}

	const voteSectionRef = useRef(null);
	const platformSectionRef = useRef(null);

	function Accordion({ akey, title, children }) {
		return (
			<article className="message is-primary">
				<div
					className="message-header"
					style={{ cursor: "pointer" }}
					onClick={() => {
						setVisiblePanels((_vp) => {
							// toggle visibility of panel with akey
							if (_vp.includes(akey)) {
								return _vp.filter((v) => v !== akey);
							}
							return [..._vp, akey];
						});
					}}
				>
					<p>{title}</p>
					<p>+</p>
					{/* <button className="plus" aria-label="plus" /> */}
				</div>
				<div
					className="message-body has-text-dark accordion-body"
					style={{ overflow: "hidden", display: visiblePanels.includes(akey) ? "block" : "none" }}
				>
					{children}
				</div>
			</article>
		);
	}

	return (
		<>
			<Head>
				<title>Brandon Yee for YCC</title>
				<meta name="description" content="Brandon Yee for YCC" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex, nofollow" />
				<link rel="icon" href="/favicon.ico" />

				<meta property="og:title" content="Unforgettable Yale: Brandon Yee for YCC" />
				<meta property="og:description" content="Brandon Yee for YCC" />
				<meta property="og:image" content="https://www.unforgettableyale.com/headshot.jpg" />
			</Head>
			<main>
				<section
					className="hero is-fullheight"
					style={{
						background: "linear-gradient(150deg, #fff, rgba(0, 50, 255, 0.4))",
					}}
				>
					<div className="hero-head">
						<div className="container grid grid-col-3 z-10">
							<div className="col-start-2 col-end-2">
								<Image
									src="/VoteYeeBlue.svg"
									width={524}
									height={213}
									alt="Brandon"
									className="scale-50"
								/>
							</div>
						</div>
					</div>
					<div className="hero-body">
						{/*  */}
						<div className="container has-text-centered">
							<p className="title">
								<Image
									className=""
									src="/headshot.jpg"
									width={256}
									height={256}
									alt="Brandon"
									style={{ margin: "0 auto", borderRadius: "50%" }}
								/>
								<br />
								<span className="text-title-blue2 is-size-1 tracking-tight font-medium">
									Brandon Yee for YCC
								</span>
							</p>
							<br />
							<p className="subtitle is-size-4 has-text-black">
								Yale, but make it{" "}
								<span style={{ borderBottom: "1px solid black" }} className="has-text-weight-bold">
									unforgettable
								</span>
								.
							</p>
						</div>
					</div>
					<div className="hero-foot">
						<div className="container has-text-centered">
							<div className="buttons mb-5 justify-center are-medium">
								<button
									className="button is-rounded clickable"
									onClick={() => platformSectionRef.current.scrollIntoView()}
								>
									Platform
								</button>
								<button
									className="button is-rounded clickable"
									onClick={() => voteSectionRef.current.scrollIntoView()}
								>
									Vote for event ideas!
								</button>
							</div>
						</div>
					</div>
				</section>

				<section className="section mx-1 md:mx-24 xl:mx-72 2xl:mx-84" ref={platformSectionRef}>
					<h1 className="title">Hello there!</h1>
					<p className="pb-3">
						My name is Brandon Yee and I am a sophomore in Davenport College. I&apos;m running for YCC
						Events Director with a mission to uphold and revitalize cherished Yale traditions while
						fostering new ones. I&apos;m passionate about creating engaging and enjoyable experiences for
						our student body. I believe that a well-planned and executed event can have a positive impact on
						our school community and help us build strong connections with one another.
					</p>
					<p className="pb-3">
						As Events Director, I will work closely with other student government members and event
						coordinators to plan events that cater to a diverse range of interests and needs. My experience
						in event planning and management, both within and outside of student government, has equipped me
						with the necessary skills to handle the logistics of organizing events, from securing venues to
						coordinating with vendors and volunteers. I am confident in my ability to create events that are
						not only fun and entertaining but also meaningful and impactful.
					</p>
					<p className="pb-3">
						My YCC background (as senator for two years) has equipped me with the knowledge and skills to
						navigate the YCC&apos;s intricacies, expediting the execution of ideas and increasing the
						frequency of student events throughout the year. My experience outside of YCC, specifically
						serving on the board of YHack, Yale&apos;s largest annual hackathon, has granted me invaluable
						insights into planning large-scale events. This expertise, combined with my YCC senatorial
						experience, has given me a comprehensive understanding of event programming and logistics.
					</p>
					<p>
						I am excited about the opportunity to serve as your Events Director and bring exciting events to
						our school community. Here&apos;s to an unforgettable Yale.
					</p>
				</section>
				<section className="section">
					<h1 className="title font-sans">My Platform</h1>
					<div className="columns is-multiline">
						<div className="column is-6">
							<Accordion akey={1} title={"Greater Student Engagement"}>
								<p>
									One of my top priorities is to increase student engagement and participation in
									campus activities. To achieve this, I will make it a point to reach out to students
									who have not traditionally attended YCC events. I recognize that there are many
									students on campus who may not feel that YCC events are relevant or interesting to
									them. However, I believe that by identifying successful events from the past, like
									Night at the Museum, we can create new opportunities to bring in non-traditional
									attendees.
								</p>
								<p>
									To do this, I will work closely with student organizations and clubs to co-sponsor
									events that cater to specific interests and needs of different student groups. I
									will also use social media platforms like Instagram, Facebook, and Twitter to create
									buzz around events and reach out to students who may not have attended in the past.
									Ultimately, my goal is to create a more inclusive and diverse campus community where
									all students feel welcome and engaged in the activities happening around them. I
									believe that by making an effort to reach out to students who have not traditionally
									attended YCC events, we can achieve this goal and make our campus a more vibrant and
									exciting place to be.
								</p>
							</Accordion>
						</div>
						<div className="column is-6">
							<Accordion akey={2} title={"Promoting Smaller Events"}>
								<p>
									While big events like concerts and comedy shows are important, smaller arts events
									often go unnoticed, despite being just as important and impactful. One way to
									promote smaller arts events is by continuing the Campus Buzz, a weekly email that
									promotes upcoming events happening on campus. This is a great way to reach a wide
									audience and ensure that all students are aware of the different artistic events
									happening around them.
								</p>
								<p>
									In addition to Campus Buzz, I propose creating a dedicated page on the YCC website
									that highlights smaller arts events happening on campus. This page could feature
									information on upcoming events, as well as positive reviews from students who have
									attended these events in the past. Another idea is to collaborate with student
									organizations and clubs to co-sponsor smaller arts events. By working together, we
									can pool resources and create more engaging and impactful events that showcase the
									artistic talents of our student body.
								</p>
								<p>
									I also propose hosting a student art exhibit, where students can showcase their
									artwork in a gallery setting. This event can feature artwork in a variety of
									mediums, including painting, photography, sculpture, and more. Finally, I propose
									partnering with local businesses and community organizations to host off-campus
									events that showcase the artistic talents of our students. This can help to create
									more opportunities for students to showcase their work and engage with the broader
									community. If elected as the Events Director, I&apos;m excited to work with student
									organizations, clubs, and other members of the YCC to create a vibrant and engaging
									calendar of events that truly reflects the artistic interests and needs of our
									diverse campus community.
								</p>
							</Accordion>
						</div>
						<div className="column is-6">
							<Accordion akey={3} title={"Increasing Student Input"}>
								<p>
									I believe that it&apos;s crucial to listen to the needs and desires of the student
									body in order to create events that truly resonate with our community. That&apos;s
									why I&apos;m committed to gathering student input to get a better sense of what
									events the student body wants me to put on. To achieve this, I plan to reach out to
									students through a variety of channels, including social media, email, and in-person
									conversations. I&apos;ll also be soliciting feedback through surveys and polls to
									make sure that all students have the opportunity to share their thoughts and ideas.
								</p>
								<p>
									By gathering student input, I&apos;ll be able to gain a deeper understanding of what
									types of events are most important to our community, and which ones will have the
									biggest impact on our campus culture. This will allow me to create a diverse range
									of events that appeal to a broad cross-section of our student body, and ensure that
									everyone has the opportunity to participate in events that they truly care about.
									Together, we can make sure that every event we put on is a success, and that our
									student body is engaged, inspired, and energized.
								</p>
								<p>
									Regarding Spring Fling, it&apos;s important that students have a say in Spring Fling
									because it is one of the biggest and most highly anticipated events of the year.
									This music concert is a chance for students to come together and celebrate the end
									of the academic year. By giving students a say in the selection of Spring Fling
									artists, we are allowing them to have a direct impact on the event and ensure that
									it reflects their tastes and preferences. This not only increases student engagement
									and excitement leading up to the event, but also helps to create a sense of
									ownership and pride in the event itself. Furthermore, by involving students in the
									selection process, we can help to create a more diverse and inclusive lineup of
									artists. This ensures that all students feel represented and included, regardless of
									their musical tastes or backgrounds.
								</p>
							</Accordion>
						</div>
						<div className="column is-6">
							<Accordion akey={4} title={"Alumni Involvement & Pre-Professional Opportunities"}>
								<p>
									Increasing the number of alumni events and career fairs on campus is crucial for
									creating opportunities for students to network with alumni and explore career
									options. By increasing the frequency and variety of these events, we can help
									students to gain valuable insights, make connections, and set themselves up for
									success after graduation. Alumni events are a fantastic way for current students to
									connect with alumni and learn from their experiences. By hosting more alumni events,
									we can help students to build relationships with alumni who can provide advice and
									support as they navigate their academic and professional careers. These events can
									include guest lectures, networking receptions, and career panels, providing a range
									of opportunities for students to engage with alumni and learn from their
									experiences.
								</p>
								<p>
									In addition to alumni events, career fairs are an important part of the
									pre-professional development process. By increasing the number of career fairs, we
									can help students to connect with potential employers and learn about job and
									internship opportunities. These events can also provide students with the
									opportunity to learn more about different industries, ask questions, and get a sense
									of what employers are looking for in job candidates. To make these events a success,
									I propose working closely with the alumni office and career services office to
									identify alumni and employers who are interested in participating in these events.
									We can also work with student organizations and clubs to co-sponsor these events,
									increasing engagement and participation among the student body.
								</p>
							</Accordion>
						</div>
						<div className="column is-6">
							<Accordion akey={5} title={"Continuing & Expanding Past Events"}>
								<p>
									It&apos;s important not only to introduce new ideas but also to ensure that previous
									successful events continue to happen. By focusing on continuing events like Last
									Comic Standing, the Fall Comedy Show, and Night at the Museum, we can maintain the
									sense of community and engagement that these events have already built.
								</p>
								<p>
									Last Comic Standing is a comedy competition that provides a platform for student
									comedians to showcase their talent and compete against one another. This event has
									been successful in the past, and I believe that it&apos;s important to continue this
									tradition and provide opportunities for student comedians to shine. The Fall Comedy
									Show is another event that has been successful in the past and showcases the talent
									of professional comedians. This year&apos;s show featuring Chris Redd was a great
									success, and I believe that it&apos;s important to continue bringing in talented
									comedians to perform for our campus community. Night at the Museum is an event that
									allows students to interact with our renowned museums and experience them in a
									unique and engaging way. This event has been a hit in the past, and I believe that
									it&apos;s important to continue providing opportunities for students to explore our
									cultural institutions.
								</p>
								<p>
									In addition to these events, I also believe in introducing new ideas and events that
									cater to the diverse interests and needs of our student body. By striking a balance
									between continuing successful events and introducing new ideas, we can create a
									dynamic and engaging campus community that reflects the interests and needs of all
									students. Overall, I&apos;m committed to continuing successful events like Last
									Comic Standing, Fall Comedy Show, and Night at the Museum, while also introducing
									new ideas that engage and inspire our campus community.
								</p>
							</Accordion>
						</div>
						<div className="column is-6">
							<Accordion akey={6} title={"Preservation of Institutional Memory"}>
								<p>
									It&apos;s important for us to focus on archiving the previous work of YCC members in
									order to preserve our institutional memory. The loss of traditions and events due to
									the COVID-19 pandemic highlights the need for us to create a comprehensive archive
									of past YCC events and initiatives. By preserving our institutional memory, we can
									ensure that the work and efforts of past YCC members are not lost and can serve as a
									foundation for future work. This can help us to avoid duplicating efforts and to
									build upon the successes of previous initiatives.
								</p>
								<p>
									To achieve this, I propose creating an archive of past YCC events and initiatives
									that includes detailed information on their goals, outcomes, and challenges. This
									archive could be made available to all YCC members and could be used as a resource
									for future planning and decision-making. Additionally, I propose creating a system
									for documenting ongoing initiatives and events in real-time, so that they can be
									added to the archive as they occur. This can help to ensure that our institutional
									memory remains up-to-date and relevant.
								</p>
								<p>
									I&apos;m currently working with the current Events Director, Agastya, to archive his
									work and ensure that his efforts are not lost. His team has done an incredible job
									of reintroducing lost traditions and events after the COVID-19 pandemic, and I
									believe that their work is an important part of our institutional memory. Overall, I
									believe that focusing on archiving the previous work of YCC members is a crucial
									step towards preserving our institutional memory and building a strong foundation
									for future work. If elected as the Events Director, I&apos;m committed to making
									this happen and ensuring that our campus community continues to benefit from the
									hard work and dedication of YCC members both past and present.
								</p>
							</Accordion>
						</div>
						{/* <div className="column is-6">
							<Accordion akey={2} title={"test"}>
								<p>hi</p>
							</Accordion>
						</div> */}
					</div>
				</section>

				<section className="section" ref={voteSectionRef}>
					<div className="container p-2 md:p-20 p-20 w-full md:w-8/12 lg:w-6/12 rounded-md">
						{posts.length > 0 && (
							<>
								<h1 className="title">Vote for the best event ideas!</h1>
								<input
									type="text"
									className="input"
									placeholder="Search for an event suggestion"
									onChange={handleSearch}
								/>
								<p>
									<br />
								</p>
							</>
						)}
						<div className="h-96 max-h-96 overflow-scroll">
							{posts.length > 0 &&
								posts
									.filter(({ post, email }) => {
										if (searchPost === "") {
											return true;
										}
										return (
											post.toLowerCase().includes(searchPost.toLowerCase()) ||
											suggestedBy(email).toLowerCase().includes(searchPost.toLowerCase())
										);
									})
									.sort((a, b) => (a.post > b.post ? 1 : -1))
									// .sort((a, b) => (a.upvotes > b.upvotes ? -1 : 1))
									.sort((a, b) => {
										if (a.ls_upvoted !== b.ls_upvoted) {
											return a.ls_upvoted ? -1 : 1;
										}
										if (a.upvotes === b.upvotes) {
											return 0;
										}
										if (a.upvotes === undefined) {
											return 1;
										}
										if (b.upvotes === undefined) {
											return -1;
										}
										return a.upvotes > b.upvotes ? -1 : 1;
									})
									.map(({ id, post, upvotes, email, ls_upvoted }) => (
										<div
											key={id}
											className={`box ${ls_upvoted ? "has-background-success-light" : ""}`}
										>
											<div className="level mb-1">
												<div className="level-left">{post}</div>
												<div className="level-right">
													{!ls_upvoted && (
														<button
															className="button is-success"
															onClick={() => upvote(id)}
														>
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
						<div className="container py-4 has-text-centered">
							<p>Scroll to see the full list.</p>
							<br />
							<p>
								If elected, the highest-voted events will be prioritized next year (within YCC&apos;s
								resources). Encourage your friends to visit this page and upvote the best ideas!
							</p>
							<br />
							<a
								className="button is-primary is-medium"
								href="https://docs.google.com/forms/d/e/1FAIpQLSe5pBjdc9RmnZhSO7aXK_LAmZQJldzMurlTioRr2TwMkUyJhQ/viewform?usp=sf_link"
								target="_blank"
							>
								Suggest an idea!
							</a>
						</div>
						<div className="container pt-32 pb-16 flex align-center scale-50 justify-center">
							<Image src="/VoteYeeBlue.svg" width={524} height={213} alt="Brandon" />
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
