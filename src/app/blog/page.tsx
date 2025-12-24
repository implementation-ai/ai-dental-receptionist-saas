import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, ExternalLink } from "lucide-react"
import { getFeed, Article } from "@/lib/rss"

const STATIC_ARTICLES: Article[] = [
    {
        id: "static-1",
        title: "IA en Odontología: ¿Amenaza u Oportunidad?",
        excerpt: "Descubre cómo la inteligencia artificial está transformando la gestión de clínicas dentales y liberando tiempo para lo importante: los pacientes.",
        category: "Tendencias",
        date: "12 Oct, 2024",
        image: "✨",
        link: "/contact"
    },
    {
        id: "static-2",
        title: "5 Estrategias para Reducir el Ausentismo de Pacientes",
        excerpt: "El 'No-Show' es uno de los mayores costes para una clínica. Aprende cómo los recordatorios inteligentes pueden ayudarte.",
        category: "Gestión",
        date: "28 Sep, 2024",
        image: "📅",
        link: "/contact"
    }
]

export default async function BlogPage() {
    // Dental News Feed (Example source: Dentistry Today or similar generic feed)
    // Using a reliable dental news RSS if possible, otherwise a tech feed as placeholder
    const RSS_URL = "https://www.odontologia33.com/rss/noticias.xml";

    const rssArticles = await getFeed(RSS_URL);
    const allArticles = [...STATIC_ARTICLES, ...rssArticles];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
                        Blog & Noticias del Sector
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Noticias, consejos y guías para modernizar tu clínica dental.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allArticles.map((article) => (
                        <Card key={article.id} className="hover:shadow-lg transition-shadow bg-white border-gray-100 overflow-hidden group flex flex-col h-full">
                            <div className="h-48 bg-blue-50/50 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-500 relative">
                                {article.image}
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-center mb-2">
                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 truncate max-w-[120px]">
                                        {article.category}
                                    </Badge>
                                    <span className="text-xs text-gray-400 flex items-center shrink-0">
                                        <Calendar className="w-3 h-3 mr-1" /> {article.date}
                                    </span>
                                </div>
                                <CardTitle className="text-lg leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                                    <Link href={article.link} target={article.link.startsWith('http') ? "_blank" : "_self"} className="hover:underline">
                                        {article.title}
                                    </Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow flex flex-col justify-between">
                                <CardDescription className="text-sm line-clamp-3 mb-4">
                                    {article.excerpt}
                                </CardDescription>
                                {article.link.startsWith('http') && (
                                    <Link href={article.link} target="_blank" className="text-blue-600 text-sm font-medium hover:underline inline-flex items-center mt-auto">
                                        Leer más <ExternalLink className="w-3 h-3 ml-1" />
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
