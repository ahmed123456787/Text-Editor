type ErrroProps = string;

const Eror = ({ error }: { error: ErrroProps }) => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default Eror;
