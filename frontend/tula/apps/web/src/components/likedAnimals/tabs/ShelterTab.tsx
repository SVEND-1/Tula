import CreateAnimalForm from '../../admin/CreateAnimalForm';

const ShelterTab = ({
                        hasOwner,
                        ownerName,
                        profile,
                        handleCreateShelter,
                        shelterName,
                        setShelterName,
                        isCreatingShelter,
                        handleCreateAnimal,
                        isCreatingAnimal
                    }: any) => (
    <div className="create-shelter-main">
        {hasOwner ? (
            <h2>{ownerName || profile?.name}</h2>
        ) : (
            <form onSubmit={handleCreateShelter}>
                <input
                    value={shelterName}
                    onChange={e => setShelterName(e.target.value)}
                />
                <button disabled={isCreatingShelter}>Создать</button>
            </form>
        )}

        <CreateAnimalForm onSubmit={handleCreateAnimal} isLoading={isCreatingAnimal} />
    </div>
);

export default ShelterTab;