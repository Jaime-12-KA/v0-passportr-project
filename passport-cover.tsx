import Image from "next/image"

const PassportCover = () => {
  return (
    <div>
      <Image src="/images/covernew-classic.png" alt="Passport Cover" width={500} height={300} priority />
    </div>
  )
}

export default PassportCover
