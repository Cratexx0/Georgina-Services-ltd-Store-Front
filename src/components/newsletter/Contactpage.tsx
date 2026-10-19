// // // src/pages/ContactPage.tsx  — Contact + FAQ combined on one page
// // import React, { useMemo, useState } from "react";
// // import { ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone, Search, Send } from "lucide-react";
// // import { toast } from "@/components/ui/sonner";
// // import Layout from "@/components/layout/Layout";

// // /* ------------------------------------------------------------------ */
// // /* ⚠️ Replace these placeholders with your real details.               */
// // /* ------------------------------------------------------------------ */
// // const CONTACT = {
// //   email: "support@georginas.com",
// //   emailNote: "Replies within 24 hours",
// //   phone: "+233 00 000 0000",
// //   phoneNote: "Mon–Fri · 9am–6pm GMT",
// //   chatUrl: "https://wa.me/233000000000", // WhatsApp / live chat link
// //   chatNote: "Average wait: 2 min",
// // };

// // const HOURS = [
// //   { day: "Mon – Fri", time: "9:00 – 18:00" },
// //   { day: "Saturday", time: "10:00 – 16:00" },
// //   { day: "Sunday", time: "Closed" },
// // ];

// // const LOCATIONS = [
// //   { city: "Accra", address: "Add your street address here" },
// //   { city: "Kumasi", address: "Add your street address here" },
// // ];

// // interface Faq {
// //   category: string;
// //   q: string;
// //   a: string;
// // }

// // const FAQS: Faq[] = [
// //   {
// //     category: "Orders",
// //     q: "How do I place an order?",
// //     a: "Browse a category, open a product, choose your size and tap Add to cart. When you're ready, go to your cart and follow the checkout steps.",
// //   },
// //   {
// //     category: "Orders",
// //     q: "Can I change or cancel my order?",
// //     a: "You can change or cancel an order before it has been shipped. Contact us as soon as possible with your order number and we'll help.",
// //   },
// //   {
// //     category: "Orders",
// //     q: "Do I need an account to buy?",
// //     a: "An account lets you track orders, save a wishlist and check out faster. Create one from the Sign in button at the top of the page.",
// //   },
// //   {
// //     category: "Shipping",
// //     q: "How long does delivery take?",
// //     a: "Delivery times depend on your location. You'll see an estimate at checkout, and we'll update you once your order ships.",
// //   },
// //   {
// //     category: "Shipping",
// //     q: "How much does shipping cost?",
// //     a: "Shipping costs are calculated at checkout based on your address and the size of your order.",
// //   },
// //   {
// //     category: "Returns",
// //     q: "What is your return policy?",
// //     a: "If an item doesn't fit or isn't what you expected, contact us within the return window with your order number. Items should be unworn and in their original condition.",
// //   },
// //   {
// //     category: "Returns",
// //     q: "How do refunds work?",
// //     a: "Once we receive and check your returned item, we refund the original payment method. Banks may take a few days to show the credit.",
// //   },
// //   {
// //     category: "Payments",
// //     q: "Which payment methods do you accept?",
// //     a: "We accept the payment methods shown at checkout, including major cards. All payments are processed securely.",
// //   },
// //   {
// //     category: "Payments",
// //     q: "Is my payment information safe?",
// //     a: "Yes. Card details are handled by our payment provider and are never stored on our servers.",
// //   },
// //   {
// //     category: "Products",
// //     q: "How do I choose the right size?",
// //     a: "Each product page lists the available sizes. If you're between sizes or unsure, contact us and we'll help you choose.",
// //   },
// //   {
// //     category: "Products",
// //     q: "Can I compare products?",
// //     a: "Yes. Tap the compare icon on up to 3 products, then open the Compare page to see them side by side.",
// //   },
// // ];

// // const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

// // /* ------------------------------------------------------------------ */

// // interface FormState {
// //   name: string;
// //   email: string;
// //   subject: string;
// //   message: string;
// // }

// // const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };

// // const inputCls =
// //   "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

// // const ChannelCard = ({
// //   icon: Icon,
// //   label,
// //   value,
// //   note,
// //   href,
// // }: {
// //   icon: React.ElementType;
// //   label: string;
// //   value: string;
// //   note: string;
// //   href: string;
// // }) => (
// //   <a
// //     href={href}
// //     target={href.startsWith("http") ? "_blank" : undefined}
// //     rel="noreferrer"
// //     className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
// //   >
// //     <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
// //       <Icon className="h-5 w-5" />
// //     </span>
// //     <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
// //     <p className="mt-1 text-lg font-semibold">{value}</p>
// //     <p className="mt-1 text-sm text-muted-foreground">{note}</p>
// //   </a>
// // );

// // const ContactPage = () => {
// //   /* ---------- contact form ---------- */
// //   const [form, setForm] = useState<FormState>(EMPTY_FORM);
// //   const [errors, setErrors] = useState<Partial<FormState>>({});

// //   const set =
// //     (key: keyof FormState) =>
// //     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
// //       setForm((f) => ({ ...f, [key]: e.target.value }));
// //       if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
// //     };

// //   const validate = () => {
// //     const er: Partial<FormState> = {};
// //     if (!form.name.trim()) er.name = "Please enter your name";
// //     if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email";
// //     if (!form.subject.trim()) er.subject = "Please add a subject";
// //     if (form.message.trim().length < 10) er.message = "Tell us a little more (10+ characters)";
// //     setErrors(er);
// //     return Object.keys(er).length === 0;
// //   };

// //   const handleSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!validate()) return;

// //     // No backend is wired up yet, so this opens the visitor's email app with the message filled in.
// //     // To send from your server instead, replace this block with a fetch("/api/contact", { method: "POST", ... }).
// //     const body = `${form.message}\n\n— ${form.name} (${form.email})`;
// //     window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
// //       form.subject
// //     )}&body=${encodeURIComponent(body)}`;

// //     toast.success("Opening your email app to send the message");
// //     setForm(EMPTY_FORM);
// //   };

// //   const fieldError = (key: keyof FormState) =>
// //     errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

// //   /* ---------- FAQ ---------- */
// //   const [category, setCategory] = useState("All");
// //   const [query, setQuery] = useState("");
// //   const [open, setOpen] = useState<string | null>(FAQS[0].q);

// //   const results = useMemo(() => {
// //     const term = query.trim().toLowerCase();
// //     return FAQS.filter(
// //       (f) =>
// //         (category === "All" || f.category === category) &&
// //         (!term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term))
// //     );
// //   }, [category, query]);

// //   return (
// //     <Layout>
// //       <main className="container mx-auto px-4 py-16">
// //         {/* hero */}
// //         <header className="mx-auto max-w-2xl text-center">
// //           <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Get in touch</p>
// //           <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">We'd love to hear from you</h1>
// //           <p className="mt-4 text-muted-foreground">
// //             Questions about a product, an order, or a partnership? Pick a channel and our team will reply quickly.
// //           </p>
// //           <a
// //             href="#faq"
// //             className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
// //           >
// //             Or browse our FAQ ↓
// //           </a>
// //         </header>

// //         {/* channels */}
// //         <section className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
// //           <ChannelCard
// //             icon={Mail}
// //             label="Email"
// //             value={CONTACT.email}
// //             note={CONTACT.emailNote}
// //             href={`mailto:${CONTACT.email}`}
// //           />
// //           <ChannelCard
// //             icon={Phone}
// //             label="Phone"
// //             value={CONTACT.phone}
// //             note={CONTACT.phoneNote}
// //             href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
// //           />
// //           <ChannelCard
// //             icon={MessageCircle}
// //             label="Live chat"
// //             value="Start a conversation"
// //             note={CONTACT.chatNote}
// //             href={CONTACT.chatUrl}
// //           />
// //         </section>

// //         {/* form + side info */}
// //         <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
// //           <form
// //             onSubmit={handleSubmit}
// //             noValidate
// //             className="rounded-2xl border border-border bg-card p-6 md:p-8"
// //           >
// //             <h2 className="text-xl font-semibold">Send a message</h2>

// //             <div className="mt-6 grid gap-5 sm:grid-cols-2">
// //               <div>
// //                 <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">
// //                   Name
// //                 </label>
// //                 <input id="name" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
// //                 {fieldError("name")}
// //               </div>
// //               <div>
// //                 <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
// //                   Email
// //                 </label>
// //                 <input
// //                   id="email"
// //                   type="email"
// //                   value={form.email}
// //                   onChange={set("email")}
// //                   placeholder="you@email.com"
// //                   className={inputCls}
// //                 />
// //                 {fieldError("email")}
// //               </div>
// //             </div>

// //             <div className="mt-5">
// //               <label htmlFor="subject" className="mb-2 block text-sm text-muted-foreground">
// //                 Subject
// //               </label>
// //               <input
// //                 id="subject"
// //                 value={form.subject}
// //                 onChange={set("subject")}
// //                 placeholder="How can we help?"
// //                 className={inputCls}
// //               />
// //               {fieldError("subject")}
// //             </div>

// //             <div className="mt-5">
// //               <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">
// //                 Message
// //               </label>
// //               <textarea
// //                 id="message"
// //                 rows={6}
// //                 value={form.message}
// //                 onChange={set("message")}
// //                 placeholder="Tell us a bit more..."
// //                 className={`${inputCls} resize-none`}
// //               />
// //               {fieldError("message")}
// //             </div>

// //             <button
// //               type="submit"
// //               className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95"
// //             >
// //               <Send className="h-4 w-4" /> Send message
// //             </button>
// //           </form>

// //           <aside className="space-y-6">
// //             <div className="rounded-2xl border border-border bg-card p-6">
// //               <h2 className="flex items-center gap-2 font-semibold">
// //                 <Clock className="h-5 w-5 text-primary" /> Office hours
// //               </h2>
// //               <dl className="mt-4 space-y-3 text-sm">
// //                 {HOURS.map((h) => (
// //                   <div key={h.day} className="flex justify-between">
// //                     <dt className="text-muted-foreground">{h.day}</dt>
// //                     <dd className="font-medium">{h.time}</dd>
// //                   </div>
// //                 ))}
// //               </dl>
// //             </div>

// //             <div className="rounded-2xl border border-border bg-card p-6">
// //               <h2 className="flex items-center gap-2 font-semibold">
// //                 <MapPin className="h-5 w-5 text-primary" /> Locations
// //               </h2>
// //               <ul className="mt-4 space-y-4 text-sm">
// //                 {LOCATIONS.map((l) => (
// //                   <li key={l.city}>
// //                     <p className="font-medium">{l.city}</p>
// //                     <p className="text-muted-foreground">{l.address}</p>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //           </aside>
// //         </section>

// //         {/* FAQ */}
// //         <section id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
// //           <div className="text-center">
// //             <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">FAQ</p>
// //             <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
// //             <p className="mt-3 text-muted-foreground">Quick answers about orders, shipping, returns and more.</p>

// //             <div className="relative mt-8">
// //               <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
// //               <input
// //                 type="search"
// //                 value={query}
// //                 onChange={(e) => setQuery(e.target.value)}
// //                 placeholder="Search questions..."
// //                 aria-label="Search questions"
// //                 className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
// //               />
// //             </div>
// //           </div>

// //           <div className="mt-6 flex flex-wrap justify-center gap-2">
// //             {CATEGORIES.map((c) => (
// //               <button
// //                 key={c}
// //                 type="button"
// //                 onClick={() => setCategory(c)}
// //                 aria-pressed={category === c}
// //                 className={`rounded-full border px-4 py-1.5 text-sm transition ${
// //                   category === c
// //                     ? "border-primary bg-primary text-primary-foreground"
// //                     : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
// //                 }`}
// //               >
// //                 {c}
// //               </button>
// //             ))}
// //           </div>

// //           <div className="mt-8 space-y-3">
// //             {results.length === 0 && (
// //               <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
// //                 No questions match "{query}". Try different words, or send us a message above.
// //               </p>
// //             )}

// //             {results.map((f) => {
// //               const isOpen = open === f.q;
// //               return (
// //                 <div
// //                   key={f.q}
// //                   className={`rounded-2xl border bg-card transition-colors ${
// //                     isOpen ? "border-primary/50" : "border-border"
// //                   }`}
// //                 >
// //                   <button
// //                     type="button"
// //                     onClick={() => setOpen(isOpen ? null : f.q)}
// //                     aria-expanded={isOpen}
// //                     className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
// //                   >
// //                     <span className="font-medium">{f.q}</span>
// //                     <ChevronDown
// //                       className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
// //                         isOpen ? "rotate-180 text-primary" : ""
// //                       }`}
// //                     />
// //                   </button>
// //                   <div
// //                     className={`grid transition-all duration-300 ease-out ${
// //                       isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
// //                     }`}
// //                   >
// //                     <div className="overflow-hidden">
// //                       <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </section>
// //       </main>
// //     </Layout>
// //   );
// // };

// // export default ContactPage;

// // src/pages/ContactPage.tsx  — Contact + FAQ combined on one page
// import React, { useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Clock,
//   Facebook,
//   Instagram,
//   Mail,
//   MapPin,
//   MessageCircle,
//   Phone,
//   Search,
//   Send,
//   Twitter,
// } from "lucide-react";
// import { toast } from "@/components/ui/sonner";
// import Layout from "@/components/layout/Layout";

// /* ------------------------------------------------------------------ */
// /* ⚠️ Replace these placeholders with your real details.               */
// /* ------------------------------------------------------------------ */
// const CONTACT = {
//   email: "support@georginas.com",
//   emailNote: "Replies within 24 hours",
//   phone: "+233 00 000 0000",
//   phoneNote: "Mon–Fri · 9am–6pm GMT",
//   chatUrl: "https://wa.me/233000000000", // WhatsApp / live chat link
//   chatNote: "Average wait: 2 min",
// };

// const HOURS = [
//   { day: "Mon – Fri", time: "9:00 – 18:00" },
//   { day: "Saturday", time: "10:00 – 16:00" },
//   { day: "Sunday", time: "Closed" },
// ];

// const LOCATIONS = [
//   { city: "Accra", address: "Add your street address here" },
//   { city: "Kumasi", address: "Add your street address here" },
// ];

// // ⚠️ Replace the "#" links with your real profile URLs.
// const SOCIALS = [
//   { label: "Facebook", icon: Facebook, url: "#" },
//   { label: "Twitter", icon: Twitter, url: "#" },
//   { label: "Instagram", icon: Instagram, url: "#" },
// ];

// const MAX_MESSAGE = 1000;

// interface Faq {
//   category: string;
//   q: string;
//   a: string;
// }

// const FAQS: Faq[] = [
//   {
//     category: "Orders",
//     q: "How do I place an order?",
//     a: "Browse a category, open a product, choose your size and tap Add to cart. When you're ready, go to your cart and follow the checkout steps.",
//   },
//   {
//     category: "Orders",
//     q: "Can I change or cancel my order?",
//     a: "You can change or cancel an order before it has been shipped. Contact us as soon as possible with your order number and we'll help.",
//   },
//   {
//     category: "Orders",
//     q: "Do I need an account to buy?",
//     a: "An account lets you track orders, save a wishlist and check out faster. Create one from the Sign in button at the top of the page.",
//   },
//   {
//     category: "Shipping",
//     q: "How long does delivery take?",
//     a: "Delivery times depend on your location. You'll see an estimate at checkout, and we'll update you once your order ships.",
//   },
//   {
//     category: "Shipping",
//     q: "How much does shipping cost?",
//     a: "Shipping costs are calculated at checkout based on your address and the size of your order.",
//   },
//   {
//     category: "Returns",
//     q: "What is your return policy?",
//     a: "If an item doesn't fit or isn't what you expected, contact us within the return window with your order number. Items should be unworn and in their original condition.",
//   },
//   {
//     category: "Returns",
//     q: "How do refunds work?",
//     a: "Once we receive and check your returned item, we refund the original payment method. Banks may take a few days to show the credit.",
//   },
//   {
//     category: "Payments",
//     q: "Which payment methods do you accept?",
//     a: "We accept the payment methods shown at checkout, including major cards. All payments are processed securely.",
//   },
//   {
//     category: "Payments",
//     q: "Is my payment information safe?",
//     a: "Yes. Card details are handled by our payment provider and are never stored on our servers.",
//   },
//   {
//     category: "Products",
//     q: "How do I choose the right size?",
//     a: "Each product page lists the available sizes. If you're between sizes or unsure, contact us and we'll help you choose.",
//   },
//   {
//     category: "Products",
//     q: "Can I compare products?",
//     a: "Yes. Tap the compare icon on up to 3 products, then open the Compare page to see them side by side.",
//   },
// ];

// const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

// /* ------------------------------------------------------------------ */

// interface FormState {
//   name: string;
//   email: string;
//   subject: string;
//   message: string;
// }

// const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };

// const inputCls =
//   "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

// const ChannelCard = ({
//   icon: Icon,
//   label,
//   value,
//   note,
//   href,
// }: {
//   icon: React.ElementType;
//   label: string;
//   value: string;
//   note: string;
//   href: string;
// }) => (
//   <a
//     href={href}
//     target={href.startsWith("http") ? "_blank" : undefined}
//     rel="noreferrer"
//     className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
//   >
//     <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
//       <Icon className="h-5 w-5" />
//     </span>
//     <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
//     <p className="mt-1 text-lg font-semibold">{value}</p>
//     <p className="mt-1 text-sm text-muted-foreground">{note}</p>
//   </a>
// );

// const ContactPage = () => {
//   /* ---------- contact form ---------- */
//   const [form, setForm] = useState<FormState>(EMPTY_FORM);
//   const [errors, setErrors] = useState<Partial<FormState>>({});

//   const set =
//     (key: keyof FormState) =>
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setForm((f) => ({ ...f, [key]: e.target.value }));
//       if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
//     };

//   const validate = () => {
//     const er: Partial<FormState> = {};
//     if (!form.name.trim()) er.name = "Please enter your name";
//     if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email";
//     if (!form.subject.trim()) er.subject = "Please add a subject";
//     if (form.message.trim().length < 10) er.message = "Tell us a little more (10+ characters)";
//     setErrors(er);
//     return Object.keys(er).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // No backend is wired up yet, so this opens the visitor's email app with the message filled in.
//     // To send from your server instead, replace this block with a fetch("/api/contact", { method: "POST", ... }).
//     const body = `${form.message}\n\n— ${form.name} (${form.email})`;
//     window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
//       form.subject
//     )}&body=${encodeURIComponent(body)}`;

//     toast.success("Opening your email app to send the message");
//     setForm(EMPTY_FORM);
//   };

//   const fieldError = (key: keyof FormState) =>
//     errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

//   /* ---------- FAQ ---------- */
//   const [category, setCategory] = useState("All");
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState<string | null>(FAQS[0].q);

//   const results = useMemo(() => {
//     const term = query.trim().toLowerCase();
//     return FAQS.filter(
//       (f) =>
//         (category === "All" || f.category === category) &&
//         (!term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term))
//     );
//   }, [category, query]);

//   return (
//     <Layout>
//       <main className="container mx-auto px-4 py-16">
//         {/* hero */}
//         <header className="mx-auto max-w-2xl text-center">
//           <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Get in touch</p>
//           <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">We'd love to hear from you</h1>
//           <p className="mt-4 text-muted-foreground">
//             Questions about a product, an order, or a partnership? Pick a channel and our team will reply quickly.
//           </p>
//           <a
//             href="#faq"
//             className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
//           >
//             Or browse our FAQ ↓
//           </a>
//         </header>

//         {/* channels */}
//         <section className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
//           <ChannelCard
//             icon={Mail}
//             label="Email"
//             value={CONTACT.email}
//             note={CONTACT.emailNote}
//             href={`mailto:${CONTACT.email}`}
//           />
//           <ChannelCard
//             icon={Phone}
//             label="Phone"
//             value={CONTACT.phone}
//             note={CONTACT.phoneNote}
//             href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
//           />
//           <ChannelCard
//             icon={MessageCircle}
//             label="Live chat"
//             value="Start a conversation"
//             note={CONTACT.chatNote}
//             href={CONTACT.chatUrl}
//           />
//         </section>

//         {/* form + side info */}
//         <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
//           <form
//             onSubmit={handleSubmit}
//             noValidate
//             className="rounded-2xl border border-border bg-card p-6 md:p-8"
//           >
//             <h2 className="text-xl font-semibold">Send a message</h2>

//             <div className="mt-6 grid gap-5 sm:grid-cols-2">
//               <div>
//                 <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">
//                   Name
//                 </label>
//                 <input id="name" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
//                 {fieldError("name")}
//               </div>
//               <div>
//                 <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
//                   Email
//                 </label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={form.email}
//                   onChange={set("email")}
//                   placeholder="you@email.com"
//                   className={inputCls}
//                 />
//                 {fieldError("email")}
//               </div>
//             </div>

//             <div className="mt-5">
//               <label htmlFor="subject" className="mb-2 block text-sm text-muted-foreground">
//                 Subject
//               </label>
//               <input
//                 id="subject"
//                 value={form.subject}
//                 onChange={set("subject")}
//                 placeholder="How can we help?"
//                 className={inputCls}
//               />
//               {fieldError("subject")}
//             </div>

//             <div className="mt-5">
//               <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">
//                 Message
//               </label>
//               <textarea
//                 id="message"
//                 rows={6}
//                 maxLength={MAX_MESSAGE}
//                 value={form.message}
//                 onChange={set("message")}
//                 placeholder="Tell us a bit more..."
//                 className={`${inputCls} resize-none`}
//               />
//               <div className="mt-1 flex items-start justify-between gap-4">
//                 <div>{fieldError("message")}</div>
//                 <p className="ml-auto text-xs text-muted-foreground">
//                   {form.message.length}/{MAX_MESSAGE}
//                 </p>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95"
//             >
//               <Send className="h-4 w-4" /> Send message
//             </button>
//           </form>

//           <aside className="space-y-6">
//             <div className="rounded-2xl border border-border bg-card p-6">
//               <h2 className="flex items-center gap-2 font-semibold">
//                 <Clock className="h-5 w-5 text-primary" /> Office hours
//               </h2>
//               <dl className="mt-4 space-y-3 text-sm">
//                 {HOURS.map((h) => (
//                   <div key={h.day} className="flex justify-between">
//                     <dt className="text-muted-foreground">{h.day}</dt>
//                     <dd className="font-medium">{h.time}</dd>
//                   </div>
//                 ))}
//               </dl>
//             </div>

//             <div className="rounded-2xl border border-border bg-card p-6">
//               <h2 className="flex items-center gap-2 font-semibold">
//                 <MapPin className="h-5 w-5 text-primary" /> Locations
//               </h2>
//               <ul className="mt-4 space-y-4 text-sm">
//                 {LOCATIONS.map((l) => (
//                   <li key={l.city}>
//                     <p className="font-medium">{l.city}</p>
//                     <p className="text-muted-foreground">{l.address}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             <div className="rounded-2xl border border-border bg-card p-6">
//               <h2 className="font-semibold">Follow us</h2>
//               <div className="mt-4 flex gap-3">
//                 {SOCIALS.map(({ label, icon: Icon, url }) => (
//                   <a
//                     key={label}
//                     href={url}
//                     target="_blank"
//                     rel="noreferrer"
//                     aria-label={label}
//                     title={label}
//                     className="grid h-10 w-10 place-items-center rounded-full bg-muted text-foreground transition hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground"
//                   >
//                     <Icon className="h-[18px] w-[18px]" />
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </aside>
//         </section>

//         {/* FAQ */}
//         <section id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
//           <div className="text-center">
//             <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">FAQ</p>
//             <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
//             <p className="mt-3 text-muted-foreground">Quick answers about orders, shipping, returns and more.</p>

//             <div className="relative mt-8">
//               <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
//               <input
//                 type="search"
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search questions..."
//                 aria-label="Search questions"
//                 className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
//               />
//             </div>
//           </div>

//           <div className="mt-6 flex flex-wrap justify-center gap-2">
//             {CATEGORIES.map((c) => (
//               <button
//                 key={c}
//                 type="button"
//                 onClick={() => setCategory(c)}
//                 aria-pressed={category === c}
//                 className={`rounded-full border px-4 py-1.5 text-sm transition ${
//                   category === c
//                     ? "border-primary bg-primary text-primary-foreground"
//                     : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
//                 }`}
//               >
//                 {c}
//               </button>
//             ))}
//           </div>

//           <div className="mt-8 space-y-3">
//             {results.length === 0 && (
//               <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
//                 No questions match "{query}". Try different words, or send us a message above.
//               </p>
//             )}

//             {results.map((f) => {
//               const isOpen = open === f.q;
//               return (
//                 <div
//                   key={f.q}
//                   className={`rounded-2xl border bg-card transition-colors ${
//                     isOpen ? "border-primary/50" : "border-border"
//                   }`}
//                 >
//                   <button
//                     type="button"
//                     onClick={() => setOpen(isOpen ? null : f.q)}
//                     aria-expanded={isOpen}
//                     className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
//                   >
//                     <span className="font-medium">{f.q}</span>
//                     <ChevronDown
//                       className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
//                         isOpen ? "rotate-180 text-primary" : ""
//                       }`}
//                     />
//                   </button>
//                   <div
//                     className={`grid transition-all duration-300 ease-out ${
//                       isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
//                     }`}
//                   >
//                     <div className="overflow-hidden">
//                       <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </section>
//       </main>
//     </Layout>
//   );
// };

// export default ContactPage;

// src/pages/ContactPage.tsx  — Contact + FAQ combined on one page
import React, { useMemo, useState } from "react";
import { ChevronDown, Clock, Mail, MapPin, MessageCircle, Phone, Search, Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import Layout from "@/components/layout/Layout";

/* ------------------------------------------------------------------ */
/* ⚠️ Replace these placeholders with your real details.               */
/* ------------------------------------------------------------------ */
const CONTACT = {
  email: "support@georginas.com",
  emailNote: "Replies within 24 hours",
  phone: "+233 00 000 0000",
  phoneNote: "Mon–Fri · 9am–6pm GMT",
  chatUrl: "https://wa.me/233000000000", // WhatsApp / live chat link
  chatNote: "Average wait: 2 min",
};

const HOURS = [
  { day: "Mon – Fri", time: "9:00 – 18:00" },
  { day: "Saturday", time: "10:00 – 16:00" },
  { day: "Sunday", time: "Closed" },
];

const LOCATIONS = [
  { city: "Accra", address: "Add your street address here" },
  { city: "Kumasi", address: "Add your street address here" },
];

interface Faq {
  category: string;
  q: string;
  a: string;
}

const FAQS: Faq[] = [
  {
    category: "Orders",
    q: "How do I place an order?",
    a: "Browse a category, open a product, choose your size and tap Add to cart. When you're ready, go to your cart and follow the checkout steps.",
  },
  {
    category: "Orders",
    q: "Can I change or cancel my order?",
    a: "You can change or cancel an order before it has been shipped. Contact us as soon as possible with your order number and we'll help.",
  },
  {
    category: "Orders",
    q: "Do I need an account to buy?",
    a: "An account lets you track orders, save a wishlist and check out faster. Create one from the Sign in button at the top of the page.",
  },
  {
    category: "Shipping",
    q: "How long does delivery take?",
    a: "Delivery times depend on your location. You'll see an estimate at checkout, and we'll update you once your order ships.",
  },
  {
    category: "Shipping",
    q: "How much does shipping cost?",
    a: "Shipping costs are calculated at checkout based on your address and the size of your order.",
  },
  {
    category: "Returns",
    q: "What is your return policy?",
    a: "If an item doesn't fit or isn't what you expected, contact us within the return window with your order number. Items should be unworn and in their original condition.",
  },
  {
    category: "Returns",
    q: "How do refunds work?",
    a: "Once we receive and check your returned item, we refund the original payment method. Banks may take a few days to show the credit.",
  },
  {
    category: "Payments",
    q: "Which payment methods do you accept?",
    a: "We accept the payment methods shown at checkout, including major cards. All payments are processed securely.",
  },
  {
    category: "Payments",
    q: "Is my payment information safe?",
    a: "Yes. Card details are handled by our payment provider and are never stored on our servers.",
  },
  {
    category: "Products",
    q: "How do I choose the right size?",
    a: "Each product page lists the available sizes. If you're between sizes or unsure, contact us and we'll help you choose.",
  },
  {
    category: "Products",
    q: "Can I compare products?",
    a: "Yes. Tap the compare icon on up to 3 products, then open the Compare page to see them side by side.",
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

/* ------------------------------------------------------------------ */

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };

const inputCls =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20";

const ChannelCard = ({
  icon: Icon,
  label,
  value,
  note,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  note: string;
  href: string;
}) => (
  <a
    href={href}
    target={href.startsWith("http") ? "_blank" : undefined}
    rel="noreferrer"
    className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
  >
    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </span>
    <p className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 text-lg font-semibold">{value}</p>
    <p className="mt-1 text-sm text-muted-foreground">{note}</p>
  </a>
);

const ContactPage = () => {
  /* ---------- contact form ---------- */
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const set =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    };

  const validate = () => {
    const er: Partial<FormState> = {};
    if (!form.name.trim()) er.name = "Please enter your name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email";
    if (!form.subject.trim()) er.subject = "Please add a subject";
    if (form.message.trim().length < 10) er.message = "Tell us a little more (10+ characters)";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // No backend is wired up yet, so this opens the visitor's email app with the message filled in.
    // To send from your server instead, replace this block with a fetch("/api/contact", { method: "POST", ... }).
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      form.subject
    )}&body=${encodeURIComponent(body)}`;

    toast.success("Opening your email app to send the message");
    setForm(EMPTY_FORM);
  };

  const fieldError = (key: keyof FormState) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  /* ---------- FAQ ---------- */
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(FAQS[0].q);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    return FAQS.filter(
      (f) =>
        (category === "All" || f.category === category) &&
        (!term || f.q.toLowerCase().includes(term) || f.a.toLowerCase().includes(term))
    );
  }, [category, query]);

  return (
    <Layout>
      <main className="container mx-auto px-4 py-16">
        {/* hero */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Get in touch</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">We'd love to hear from you</h1>
          <p className="mt-4 text-muted-foreground">
            Questions about a product, an order, or a partnership? Pick a channel and our team will reply quickly.
          </p>
          <a
            href="#faq"
            className="mt-5 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Or browse our FAQ ↓
          </a>
        </header>

        {/* channels */}
        <section className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          <ChannelCard
            icon={Mail}
            label="Email"
            value={CONTACT.email}
            note={CONTACT.emailNote}
            href={`mailto:${CONTACT.email}`}
          />
          <ChannelCard
            icon={Phone}
            label="Phone"
            value={CONTACT.phone}
            note={CONTACT.phoneNote}
            href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
          />
          <ChannelCard
            icon={MessageCircle}
            label="Live chat"
            value="Start a conversation"
            note={CONTACT.chatNote}
            href={CONTACT.chatUrl}
          />
        </section>

        {/* form + side info */}
        <section className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.6fr_1fr]">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-2xl border border-border bg-card p-6 md:p-8"
          >
            <h2 className="text-xl font-semibold">Send a message</h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm text-muted-foreground">
                  Name
                </label>
                <input id="name" value={form.name} onChange={set("name")} placeholder="Your name" className={inputCls} />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm text-muted-foreground">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@email.com"
                  className={inputCls}
                />
                {fieldError("email")}
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="subject" className="mb-2 block text-sm text-muted-foreground">
                Subject
              </label>
              <input
                id="subject"
                value={form.subject}
                onChange={set("subject")}
                placeholder="How can we help?"
                className={inputCls}
              />
              {fieldError("subject")}
            </div>

            <div className="mt-5">
              <label htmlFor="message" className="mb-2 block text-sm text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell us a bit more..."
                className={`${inputCls} resize-none`}
              />
              {fieldError("message")}
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90 active:scale-95"
            >
              <Send className="h-4 w-4" /> Send message
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <Clock className="h-5 w-5 text-primary" /> Office hours
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                {HOURS.map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <dt className="text-muted-foreground">{h.day}</dt>
                    <dd className="font-medium">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-2 font-semibold">
                <MapPin className="h-5 w-5 text-primary" /> Locations
              </h2>
              <ul className="mt-4 space-y-4 text-sm">
                {LOCATIONS.map((l) => (
                  <li key={l.city}>
                    <p className="font-medium">{l.city}</p>
                    <p className="text-muted-foreground">{l.address}</p>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto mt-24 max-w-3xl scroll-mt-24">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">FAQ</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked questions</h2>
            <p className="mt-3 text-muted-foreground">Quick answers about orders, shipping, returns and more.</p>

            <div className="relative mt-8">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                aria-label="Search questions"
                className="w-full rounded-full border border-border bg-background py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 text-sm transition ${
                  category === c
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 space-y-3">
            {results.length === 0 && (
              <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
                No questions match "{query}". Try different words, or send us a message above.
              </p>
            )}

            {results.map((f) => {
              const isOpen = open === f.q;
              return (
                <div
                  key={f.q}
                  className={`rounded-2xl border bg-card transition-colors ${
                    isOpen ? "border-primary/50" : "border-border"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : f.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-medium">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default ContactPage;