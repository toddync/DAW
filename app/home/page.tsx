'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Wifi, Wind, Droplets, Coffee, Music, Zap } from 'lucide-react'

export default function HomePage() {
  const amenities = [
    { icon: Wifi, label: 'WiFi Gratuito', description: 'Internet de alta velocidade em todos os quartos' },
    { icon: Coffee, label: 'Café da Manhã Incluso', description: 'Café da manhã de cortesia diariamente' },
    { icon: Users, label: 'Eventos Sociais', description: 'Eventos comunitários e passeios' },
    { icon: Wind, label: 'Ar Condicionado', description: 'Controle de temperatura em todos os quartos' },
    { icon: Droplets, label: 'Chuveiros Quentes', description: 'Acesso a água quente 24/7' },
    { icon: Music, label: 'Entretenimento', description: 'Música ao vivo e noites de jogos' },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'Singapura',
      text: 'Melhor experiência em hostel! Fiz amigos incríveis e a equipe foi muito prestativa.',
      rating: 5,
    },
    {
      name: 'James Mitchell',
      location: 'Austrália',
      text: 'Quartos limpos, vibe incrível e o café da manhã é fantástico. Recomendo muito!',
      rating: 5,
    },
    {
      name: 'Maria Garcia',
      location: 'Espanha',
      text: 'Ótima localização e atmosfera super amigável. Com certeza voltarei!',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Seção Hero */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 space-y-8 text-center">
          <div className="inline-block">
            <Badge variant="outline" className="mb-4">Bem-vindo ao Hostel Santa Teresa</Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">
            Sua Casa Longe de Casa
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Vivencie uma comunidade vibrante no coração da cidade. Conheça viajantes de todo o mundo, compartilhe histórias e crie memórias inesquecíveis.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/booking">
              <Button size="lg" className="text-base">
                Reserve seu Quarto
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base">
              Saiba Mais
            </Button>
          </div>
        </div>
      </section>

      {/* Imagem Hero */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden bg-muted">
          <Image
            src="/placeholder.svg?height=500&width=1200"
            alt="Área Comum do Hostel Santa Teresa"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Seção de Vantagens */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Por que Escolher o Hostel Santa Teresa?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos a combinação perfeita de conforto, comunidade e aventura.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {amenities.map((amenity) => {
            const Icon = amenity.icon
            return (
              <Card key={amenity.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg">{amenity.label}</h3>
                  <p className="text-sm text-muted-foreground">{amenity.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Mostruário de Quartos */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Quartos Confortáveis</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Escolha entre dormitórios aconchegantes ou quartos privativos, todos com camas limpas e comodidades modernas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Dormitório 4 Camas', price: 'R$ 95', image: 'quarto de hostel econômico com beliches' },
              { name: 'Dormitório 6 Camas', price: 'R$ 80', image: 'dormitório de hostel limpo com várias camas' },
              { name: 'Quarto Privativo', price: 'R$ 240', image: 'quarto de hostel privativo com cama de casal e banheiro' },
            ].map((room) => (
              <Card key={room.name} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-muted">
                  <Image
                    src={`/placeholder.svg?height=200&width=300&query=${room.image}`}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{room.name}</h3>
                      <p className="text-sm text-muted-foreground">Por noite</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{room.price}</span>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/booking">Ver Disponibilidade</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">O que os Hóspedes Dizem</h2>
          <p className="text-lg text-muted-foreground">Junte-se a centenas de viajantes felizes</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="flex flex-col">
              <CardContent className="p-6 flex-1 space-y-4">
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {testimonial.location}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Seção CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Pronto para Reservar?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Encontre a cama perfeita e comece sua aventura conosco hoje mesmo.
          </p>
          <Link href="/booking">
            <Button size="lg" variant="secondary" className="text-base">
              Ver Quartos
            </Button>
          </Link>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-muted border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">H</span>
                </div>
                <span className="font-bold text-foreground">Hostel Santa Teresa</span>
              </div>
              <p className="text-sm text-muted-foreground">Sua casa longe de casa</p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Links Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground">Início</Link></li>
                <li><Link href="/booking" className="text-muted-foreground hover:text-foreground">Quartos</Link></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Sobre</a></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Contato</h4>
              <ul className="space-y-2 text-sm">
                <li className="text-muted-foreground">📧 info@urbanhostel.com</li>
                <li className="text-muted-foreground">📞 +55 (21) 99999-9999</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">Siga-nos</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Instagram</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2025 Hostel Santa Teresa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
