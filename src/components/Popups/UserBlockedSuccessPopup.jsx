const UserBlockedSuccessPopup = ({
  showPopup,
  setShowPopup,
  title,
  description,
}) => {
  return (
    showPopup && (
      <main className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.4)]">
        <div className="w-full max-w-[471px]  bg-white flex flex-col items-center gap-2 rounded-[18px] p-7 lg:p-10 relative">
          <button
            type="button"
            onClick={() => {
              setShowPopup(false);
            }}
            className="absolute top-5 right-5"
          >
            <img
              src="/modal-close-icon.svg"
              alt="modal-close-icon"
              className="w-[22px] h-[22px]"
            />
          </button>
          <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
            <img
              src="/check-icon.svg"
              alt="check-icon"
              className="w-[31px] h-[23px] invert brightness-0"
            />
          </div>
          <h2 className="text-[24px] font-semibold leading-[1.3] text-center">
            {title}
          </h2>
          <p className="text-[var(--secondary-color)] text-center leading-[1.3]">
            {description}
          </p>
        </div>
      </main>
    )
  );
};

export default UserBlockedSuccessPopup;
