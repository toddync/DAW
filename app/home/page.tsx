'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Users, Wifi, Wind, Droplets, Coffee, Music, Zap, Star, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react'

export default function HomePage() {
  const amenities = [
    { icon: Wifi, label: 'WiFi Ultra-Rápido', description: 'Conexão de fibra óptica em todos os ambientes' },
    { icon: Coffee, label: 'Café Gourmet', description: 'Café da manhã artesanal preparado diariamente' },
    { icon: Users, label: 'Comunidade Global', description: 'Conecte-se com viajantes de mais de 50 países' },
    { icon: Wind, label: 'Climatização Total', description: 'Ambientes sempre frescos e confortáveis' },
    { icon: Droplets, label: 'Banheiros Premium', description: 'Duchas de alta pressão e água quente 24h' },
    { icon: Music, label: 'Lounge & Eventos', description: 'Música ao vivo, workshops e happy hours' },
  ]

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'Singapura',
      text: 'Uma experiência transformadora! O design é impecável e a comunidade é super acolhedora. Definitivamente o melhor hostel que já fiquei.',
      rating: 5,
      avatar: '/avatars/sarah.jpg'
    },
    {
      name: 'James Mitchell',
      location: 'Austrália',
      text: 'Luxo acessível no coração da cidade. As camas são super confortáveis e o staff faz você se sentir em casa desde o primeiro momento.',
      rating: 5,
      avatar: '/avatars/james.jpg'
    },
    {
      name: 'Maria Garcia',
      location: 'Espanha',
      text: 'A localização é perfeita e a vibe do lugar é única. Fiz amizades para a vida toda aqui. Recomendo de olhos fechados!',
      rating: 5,
      avatar: '/avatars/maria.jpg'
    },
  ]

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Hostel Santa Teresa Vibe"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-background" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 mb-4">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-medium">Eleito o Melhor Hostel do Rio em 2024</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight text-balance drop-shadow-lg">
            Sua Casa <span className="text-primary-foreground/90 italic">Longe de Casa</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto text-pretty font-light leading-relaxed drop-shadow-md">
            Descubra uma nova forma de viajar. Conforto premium, design autêntico e uma comunidade vibrante esperando por você no coração de Santa Teresa.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/booking">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all duration-300 bg-primary text-primary-foreground border-none">
                Reservar Agora
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/40 transition-all duration-300">
              Explorar o Hostel
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-current rounded-full" />
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-border to-transparent" />
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Experiência Premium</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              Cada detalhe foi pensado para proporcionar o máximo de conforto e conveniência durante sua estadia.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            {amenities.map((amenity, idx) => {
              const Icon = amenity.icon
              return (
                <div key={amenity.label} className="group p-6 rounded-2xl bg-card hover:bg-accent/50 border border-border/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 text-primary transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{amenity.label}</h3>
                  <p className="text-muted-foreground leading-relaxed">{amenity.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Rooms Showcase */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Nossas Acomodações</h2>
              <p className="text-xl text-muted-foreground max-w-xl font-light">
                Do social ao privativo, encontre o espaço perfeito para recarregar suas energias.
              </p>
            </div>
            <Link href="/booking">
              <Button variant="ghost" className="group text-lg font-medium hover:bg-transparent hover:text-primary p-0">
                Ver todos os quartos <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Dormitório Social', price: 'R$ 95', capacity: '4 Pessoas', image: 'quarto de hostel moderno e iluminado' },
              { name: 'Dormitório Comfort', price: 'R$ 80', capacity: '6 Pessoas', image: 'beliches premium com cortinas de privacidade' },
              { name: 'Suíte Privativa', price: 'R$ 240', capacity: 'Casal', image: 'quarto de casal estilo boutique hotel' },
            ].map((room) => (
              <Card key={room.name} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-card">
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=600&width=400&query=${room.image}`}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <Badge variant="secondary" className="mb-3 bg-white/20 backdrop-blur-md text-white border-white/20 hover:bg-white/30">{room.capacity}</Badge>
                    <h3 className="text-2xl font-bold mb-1">{room.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6 flex items-center justify-between bg-card relative z-10">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">A partir de</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-primary">{room.price}</span>
                      <span className="text-muted-foreground">/noite</span>
                    </div>
                  </div>
                  <Link href="/booking">
                    <Button size="icon" className="rounded-full w-12 h-12 bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 tracking-tight">Histórias de Quem Já Veio</h2>
            <div className="flex justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <p className="text-lg text-muted-foreground">4.9/5 baseado em mais de 500 avaliações</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-secondary/20 border-none shadow-none hover:bg-secondary/40 transition-colors duration-300">
                <CardContent className="p-8 space-y-6">
                  <div className="flex gap-1 text-yellow-400">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground/80 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {/* Placeholder avatar since we don't have real images yet */}
                      <span className="text-lg font-bold text-muted-foreground">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute inset-0 bg-linear-to-r from-primary via-primary/90 to-primary/80" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground tracking-tight">Sua Próxima Aventura Começa Aqui</h2>
          <p className="text-xl md:text-2xl text-primary-foreground/80 font-light max-w-2xl mx-auto">
            Não deixe para depois. Garanta seu lugar no hostel mais vibrante do Rio de Janeiro.
          </p>
          <div className="pt-4">
            <Link href="/booking">
              <Button size="lg" variant="secondary" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
                Ver Disponibilidade
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">H</span>
                </div>
                <span className="font-bold text-xl text-foreground">Hostel Santa Teresa</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Mais que uma hospedagem, uma experiência de conexão e descoberta no coração cultural do Rio.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 rounded-full">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 rounded-full">
                  <Facebook className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10 rounded-full">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-foreground text-lg">Explorar</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Início</Link></li>
                <li><Link href="/booking" className="hover:text-primary transition-colors">Acomodações</Link></li>
                <li><Link href="/packages" className="hover:text-primary transition-colors">Pacotes Especiais</Link></li>
                <li><Link href="/events" className="hover:text-primary transition-colors">Eventos</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-foreground text-lg">Suporte</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Fale Conosco</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacidade</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="font-bold text-foreground text-lg">Contato</h4>
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span>Rua Almirante Alexandrino, 123<br />Santa Teresa, Rio de Janeiro</span>
                </li>
                <li className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-primary shrink-0" />
                  <span>+55 (21) 99999-9999</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span>Aberto 24 horas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Hostel Santa Teresa. Todos os direitos reservados.
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              Feito com <span className="text-red-500">♥</span> no Rio de Janeiro
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
