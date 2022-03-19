
function ThankYouNote() {
  return (
    <section className="py-20 flex" style={{ height: "calc(100vh - 20rem)" }}>
      <div className="max-w-3xl mx-auto mt-10 text-center self-center">
        <h1 className="lg:text-5xl md:text-4xl text-3xl font-extrabold" data-aos="fade-down">
          Thank you!
        </h1>
        <p className="pt-5">
          You can visit our <a className="text-yellow-500 underline" href="https://opensea.io/collection/nomaguild">OpenSea.io</a> to see your mummies.
        </p>
      </div>
    </section>
  );
}

export default ThankYouNote;
