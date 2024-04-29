const LoadingSpinner = () => (
    <div style={{textAlign:'center'}}>
        <svg width="30" height="30" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#ddd" strokeWidth="10" strokeLinecap="round">
                <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
            </circle>
        </svg>
    </div>
);

export default LoadingSpinner;