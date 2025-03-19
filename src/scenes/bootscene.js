import Phaser from 'phaser';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyAbOxkrFAyeOlR5xqtNBS3ux0rUUNBRby0",
  
    authDomain: "memory-game-15893.firebaseapp.com",
  
    projectId: "memory-game-15893",
  
    storageBucket: "memory-game-15893.firebasestorage.app",
  
    messagingSenderId: "299091160701",
  
    appId: "1:299091160701:web:ec5c948f7475a974240b14",
  
    measurementId: "G-9PFQGSRGMG"
  
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export class BootScene extends Phaser.Scene {
    constructor(){
        super("scene-boot");
    }

    preload(){
        const instanceID = "abc456"; // getQueryParam('instance_id');

        // if (!instanceId) {
        //     console.error("Instance ID not found in URL.");
        //     return;
        // }

        

        this.loadGameAssets(instanceID).then((assetPathUrl) => {
        console.log("Data loaded : "+assetPathUrl);

            this.scene.launch('MainMenu', { assetPathUrl });
        });        
    }

    async loadGameAssets(instanceId) {
        // Fetch Firestore document
        const docRef = doc(db, "game-instences", instanceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().assetPathUrl; // Assumes assets field contains asset URLs

        } else {
            console.error("No such document!");
            return null;
        }
    }
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// export default BootScene;