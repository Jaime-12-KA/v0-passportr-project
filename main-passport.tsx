import Image from "next/image"

const MainPassport = () => {
  return (
    <div>
      {/* Example usage of the Image component.  Adjust as needed for your layout. */}
      <Image src="/images/new-cover-classic.png" alt="Passportr main cover" width={500} height={300} priority />
      {/* Rest of your component's content here */}
    </div>
  )
}

export default MainPassport
