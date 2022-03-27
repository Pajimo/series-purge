Quick info,  to be able to access the database, you will need to get your personal keys and config from the firebase website. I have hidden mine so running the code locally will result in error. After you clone, get your personal firebase config for running. It is important for the database part especially except you have your way around the back end.

## Series Purge

This is an application built using NEXTjs, a React.js Framework. It is basically a site for getting information about tv-shows you are interested in. 
And if you are a great fan of any like I am with Billions and Power series, you can add them to your list and monitor when the next episodes will be aired. That way you wont have to stuff your brain with dates of all the series you are following.

You have the option to sign up or just view interested information on the application. 
Not signing up has its limitations tho, like not being able to save interested tvshows in your personal list that can only be seen by you. 

The same way you can add to your list, you can also remove from your list if for instance you do not like the show anymore or the series has ended.

An option to connect with me using the support page incase of any enquires or information or disturbances, it is connected to its own firestore database and i can see messages sent from the support page in my very own personal page which is the admin page that is only accessible to me, so that way i get to see all messages and reply to them as soon as i can.

In-case you do decided you no longer want to be a member of series purge after creating an account, you have the option to delete your account. That would be rather sad.

This is a fun project and my first Full stack project. A project with boh front end and backend. I personally created the front end using Nextjs and made use of a BAAS for the backend, Firebase. The firebase databse, firestore was used for the database.

TMDB, the movies database was the source of the data used in the application. The data they posses is really impressive.

This project uses the TMDB API but is not endorsed or certified by TMDB. The TMDB API was fecthed using the fetch API and in the main page of my applicaton, i made use of the getServerSideProps which is from using nextjs to pre-render pages.

## All technologies used to develop this web app
- Next.js (React)
- Taiwind CSS (Full styling)
- Material Ui (Some use cases like pop over)
- TMDB API
- FIrebase Auth
- FIrebase Firestore
- Vercel (Deployment / hosting)
- Fetch APi (Api fetching)
- One Signal (notifications)
- Moment.js (for calendar)
- React Icons
- Toastify (for actions notifications like notifying of a successful login)
- UseState
- UseEffect
- UseRouter
- Promise (async/await)
- GitHub / Git 
- And many more little ones.....


## Getting Started

First clone the repo 

```bash
git clone 'https.......'
```

Then 
```bash
npm install to get all the required dependencies to make your application run locally

```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
