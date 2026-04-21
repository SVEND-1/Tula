const MyPetsTab = ({
                       hasOwner,
                       myAnimals,
                       /*getAnimalImage,*/
                       getAgeText,
                       getStatusText,
                       getStatusClass,
                       setActiveTab
                   }: any) => (
    <div className="mypets-main">
        <h2>Мои питомцы</h2>

        {hasOwner && myAnimals.length > 0 ? (
            <div className="pets-grid">
                {myAnimals.map((animal: any) => (
                    <div key={animal.id} className="pet-card">
                        <h4>{animal.name}</h4>
                        <p>{getAgeText(animal.age)}</p>
                        <span className={getStatusClass(animal.status)}>
                            {getStatusText(animal.status)}
                        </span>
                    </div>
                ))}
            </div>
        ) : (
            <button onClick={() => setActiveTab('createShelter')}>
                Создать приют
            </button>
        )}
    </div>
);

export default MyPetsTab;