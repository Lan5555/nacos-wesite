import { FaBookOpen, FaChartColumn, FaBell, FaHandshakeSimple } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";

interface FeatureItem {
    icon: React.ReactNode;
    text: string;
}
const features: FeatureItem[] = [
    {
        icon: <FaBookOpen size={18} className="text-blue-500" />,
        text: "Access 200+ study materials by level"
    },
    {
        icon: <FaChartColumn size={18} className="text-blue-500"/>,
        text: "View your semester results & GPA tracker"
    },
    {
        icon: <FaRegCalendarAlt size={18} className="text-blue-500"/>,
        text: "Register for events, workshops & hackathons"
    },
    {
        icon: <FaBell size={18} className="text-amber-400" />,
        text: "Get real-time updates & exam notifications"
    },
    {
        icon: <FaHandshakeSimple size={18} className="text-amber-400" />,
        text: "Connect with NACOS excos and peers"
    }
];
export default function AuthHero() {
    return (
        <section className="relative flex h-full flex-col justify-between overflow-hidden px-12 py-10 text-white"
            style={{
                backgroundImage: `
            radial-gradient(
            circle at 50% 20%,
            #124912 0%,
            #092d09 50%,
            #0c370c 100%
            )
            `
            }}
        >
            <header className="relative z-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#59C559] font-bold text-white">
                    N
                </div>
                <h1 className="text-2xl font-bold tracking-tighter">NAC<span className="text-[#72d872]">OS</span> Nigeria</h1>
            </header>
            <div className="relative z-10 mt-10 max-w-xl">
                <h1 className="text-5xl font-extrabold leading-10">Your Academic
                    <br />
                    <span className="text-[#72d872]">Journey Starts</span>
                    <br />
                    <span>Here.</span>
                </h1>
                <p className="mt-8 text-lg leading-8 text-green-100/80">Log in to access study materials, view your results, track events, and connect with thousands of CS students across Nigeria.</p>

                <div className="mt-10 space-y-4">
                    {features.map((feature) => (
                        <div key={feature.text} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-hite/10 px-5 py-4 backdrop-blur-sm">
                            <div>
                            {feature.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white/90">{feature.text} </p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>
        </section>
    )
}