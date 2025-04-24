interface ProjectCardProps {
  image: string
  title: string
  capacity: string
  description: string
}

export default function ProjectCard({ image, title, capacity, description }: ProjectCardProps) {
  return (
    <div className="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100 hover:border-[#ff6a00] transform hover:-translate-y-2">
      <div className="h-56 overflow-hidden relative">
        <div
          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <span className="text-xs font-medium bg-[#ff6a00] text-white px-3 py-1 rounded-full whitespace-nowrap">
            {capacity}
          </span>
        </div>
        <div className="h-16 mb-4">
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}
