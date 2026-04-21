import { useLikedAnimals } from './useLikedAnimals';

import Background from '../../components/likedAnimals/ui/Background';
import Loading from '../../components/likedAnimals/ui/Loading';
import LikedHeader from '../../components/likedAnimals/LikedHeader';
import Sidebar from '../../components/likedAnimals/Sidebar';

import ProfileTab from '../../components/likedAnimals/tabs/ProfileTab';
import MyPetsTab from '../../components/likedAnimals/tabs/MyPetsTab';
import LikedTab from '../../components/likedAnimals/tabs/LikedTab';
import ShelterTab from '../../components/likedAnimals/tabs/ShelterTab';
import ReviewsTab from '../../components/likedAnimals/tabs/ReviewsTab';

export default function LikedAnimals() {
    const state = useLikedAnimals();

    if (state.isLoading) return <Loading />;

    return (
        <>
            <Background />

            <LikedHeader
                navigate={state.navigate}
                setActiveTab={state.setActiveTab}
                profile={state.profile}
            />

            <main className="liked-container">
                <Sidebar {...state} />

                <div className="main-content">
                    {state.activeTab === 'profile' && <ProfileTab {...state} />}
                    {state.activeTab === 'mypets' && <MyPetsTab {...state} />}
                    {state.activeTab === 'liked' && <LikedTab {...state} />}
                    {state.activeTab === 'createShelter' && <ShelterTab {...state} />}
                    {state.activeTab === 'reviews' && (
                        <ReviewsTab
                            profile={state.profile}
                            formatDate={state.formatDate}
                        />
                    )}
                </div>
            </main>
        </>
    );
}