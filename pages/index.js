import Head from "next/head";
import { MongoClient } from "mongodb";
import MeetupList from "../components/meetups/MeetupList";
import { Fragment } from "react";

function HomePage(props) {
  return (
    <Fragment>
      <Head>
        <title>React Meetups</title>
        <meta
          name="description"
          content="Browse a huge list of highly active React meetups"
        />
      </Head>
      <MeetupList meetups={props.meetups} />;
    </Fragment>
  );
}
//  if you need access to request and respond or data gange multiple times every second
// export async function getServerSideProps(context){
//     const req = context.req;
//     const res = context.res;
//     console.log(req)
//     console.log(res)
//     // fetch data from aan API
//     return {
//         props: {
//             meetups:DUMMY_MEETUPS
//         },
//     };
// }
export async function getStaticProps() {
  //fetch data from API
  const client = await MongoClient.connect(
    "mongodb+srv://AceAmr:4253994Ace@cluster0.q08hc.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();
  const meetupsCollection = db.collection("meetups");

  const meetups = await meetupsCollection.find().toArray();
  client.close();
  return {
    props: {
      meetups: meetups.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1, // number of seconds that will make it regenreated on the server to replace outdata data
  };
}
export default HomePage;
