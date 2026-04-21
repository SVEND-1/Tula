const Background = () => (
    <div className="bg-animation">
        {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`floating-shape shape-bg-${i + 1}`} />
        ))}
    </div>
);

export default Background;