import Image from "next/image"

const PassportCover = () => {
  return (
    <div className="relative">
      <Image
        src="/images/covernew-classic.png"
        alt="Passportr main cover"
        width={500}
        height={300}
        layout="responsive"
        className="w-full h-auto"
        style={{ filter: "saturate(1.2) brightness(1.1)" }}
      />
    </div>
  )
}

export default PassportCover
