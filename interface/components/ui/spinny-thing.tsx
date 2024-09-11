export const SpinnyThing = ({status}) => {
    if (status === "done") {
        return <span className="text-center font-bold">Done! Complete report is saved here: <a href="#">LINK</a></span>
    } else if (status === "busy") {
    return     <div className="text-white p-4 text-center">  <div
    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-success motion-reduce:animate-[spin_1.5s_linear_infinite]"
    role="status">
    <span
      className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
    >Loading...</span>
  </div>
  <span className="text-center font-bold">Please wait... do not close your browser!</span></div>

    }
else {
    return <span className="text-center font-bold">Fact-Checker Ready</span>
}
}