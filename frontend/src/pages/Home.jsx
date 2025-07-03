import { useEffect, useState } from 'react';
import { Sun, Moon, CheckCircle, AlarmClock, CalendarDays, Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router'
import dashboard from '../assets/images/dashboard.png';
import dashboardlight from '../assets/images/dashboardlight.png';
import logo from '/chrono.svg';
import Highlights from '../components/home/Highlights'
import reminders from '../assets/images/reminders.png'
import remindersDark from '../assets/images/reminderslight.png'
import calendar from '../assets/images/calendar.png'
import calendarlight from '../assets/images/calendarlight.png'
import stats from '../assets/images/stats.png'
import statslight from '../assets/images/statslight.png'
import tasks from '../assets/images/tasks.png'
import taskslight from '../assets/images/taskslight.png'
import Login from '../components/home/Login'

export default function HeroSection() {
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.documentElement.classList.add('dark');
            setIsDark(true);
        } else {
            document.documentElement.classList.remove('dark');
            setIsDark(false);
        }
    }, []);

    const toggleTheme = () => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };


    const features = [
        {
            title: 'Smart Task Management',
            desc: 'Add tasks with priorities, detailed descriptions, and real-time updates to stay ahead of your day.',
            icon: <CheckCircle size={28} />,
        },
        {
            title: 'Reminders & Calendar Sync',
            desc: 'Integrate with your calendar and set smart reminders to never miss what matters.',
            icon: <AlarmClock size={28} />,
        },
        {
            title: 'Track Progress Visually',
            desc: 'Build streaks, monitor completions, and get weekly overviews to reflect and improve.',
            icon: <CalendarDays size={28} />,
        },
        {
            title: 'Organize with Tags & Filters',
            desc: 'Use customizable tags and powerful filters to keep your workflow structured and searchable.',
            icon: <Tag size={28} />,
        },
    ];

    return (
        <>
            <section className={`relative w-full min-h-screen flex flex-col px-4 md:px-6 pb-20 ${isDark ? 'bg-[#1a1a1a] text-white' : 'bg-[#f9fafb] text-black'}`}>
                {/* Header */}
                <header className="w-full flex justify-between items-center py-4 px-2 md:px-6 z-20">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="Chrono logo" className="w-8 h-8" />
                        <span className="text-xl font-semibold">Chrono</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/auth" className={`px-4 py-2 rounded-lg text-sm font-medium ${isDark ? 'bg-[#f3f3f3] text-black' : 'bg-[#e5e5e5] text-black'} hover:opacity-90`}>
                            Login
                        </Link>
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>
                </header>

                {/* Headline */}
                <div className="mt-10 mb-20 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        Plan smarter. Stay consistent. Build momentum.
                    </h1>
                    <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                        <span style={{ color: '#cb00fb' }}>Chrono</span> is your all-in-one tool for focused execution,
                        powered by priorities, reminders, and habit-building insights.
                    </p>
                </div>

                {/* Screenshot */}
                <div className="relative w-full overflow-hidden pointer-events-none z-0 mb-64">
                    <div
                        className="mx-auto w-11/12 max-w-7xl h-[60vh] bg-cover bg-top rounded-xl border border-b-0 border-zinc-300 dark:border-zinc-700 relative"
                        style={{ backgroundImage: `url(${isDark ? dashboard : dashboardlight})` }}
                    >
                        <div className={`${isDark ? 'bg-gradient-to-b from-transparent to-[#1a1a1a]' : 'bg-gradient-to-b from-transparent to-[#f9fafb]'} h-full w-full absolute top-0 left-0 rounded-xl`} />
                    </div>
                    <div
                        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-11/12 max-w-7xl h-24 pointer-events-none ${isDark ? 'bg-gradient-to-b from-transparent to-[#1a1a1a]' : 'bg-gradient-to-b from-transparent to-[#f9fafb]'}`}
                    />
                </div>
                <section className="w-full pb-28 px-6 max-w-7xl mx-auto">
                    <h2 className="text-2xl md:text-4xl mb-8 max-w-7xl text-center mx-auto">Why chose <span className="text-[#cb00fb]">Chrono</span>?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Built for Individuals</h3>
                            <p className="text-sm opacity-80">Chrono is designed for your personal productivity. No complex team tools or confusing dashboards - just clean, simple task and time management.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">No Bloat</h3>
                            <p className="text-sm opacity-80">Every feature is useful and intentional. You won’t find unnecessary settings, bloated menus, or overwhelming workflows here.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
                            <p className="text-sm opacity-80">Your data stays yours. Chrono doesn’t track you, and there’s no third-party analytics or marketing tools involved.</p>
                        </div>
                    </div>
                </section>


                {/* Feature Cards */}
                <h2 className="text-2xl md:text-4xl mb-8 max-w-7xl mx-auto">Master your time and Achieve more with <span className="text-[#cb00fb]">Chrono</span></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 mx-auto lg:grid-cols-4 gap-6 w-full max-w-7xl px-4 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl p-6 flex flex-col items-start justify-start gap-2 shadow-md border transition-none ${isDark ? 'bg-[#232323] border-[#2e2e2e]' : 'bg-[#fdfdfd] border-[#e0e0e0]'}`}
                        >
                            <div className="text-[#cb00fb] mb-2">{feature.icon}</div>
                            <h3 className="text-lg font-semibold">{feature.title}</h3>
                            <p className="text-sm opacity-80 text-left leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Highlight Section */}
                <Highlights
                    heading={
                        <span className="inline-flex items-center gap-2 text-[#cb00fb] text-3xl font-bold">
                            Dashboard Overview <ChevronRight size={24} strokeWidth={2.2} />
                        </span>
                    }
                    description={`The dashboard gives you a clear view of what's happening today. 
You’ll see your active tasks, reminders that are due soon, and recent updates all in one place.

It's designed to be a calm starting point. Open the app and you’ll know exactly what to focus on without needing to click around or sort through lists.`}
                    imageLight={dashboardlight}
                    imageDark={dashboard}
                />

                <Highlights
                    heading={
                        <span className="inline-flex items-center gap-2 text-[#cb00fb] text-3xl font-bold">
                            Tasks Organized <ChevronRight size={24} strokeWidth={2.2} />
                        </span>
                    }
                    description={`Create tasks with just a title and due date. You can also add tags if you want to group them or filter later.

The task list is built to help you focus. Whether you're planning ahead or just checking what’s left, you can easily sort, search, and keep things manageable without distractions.`}
                    imageLight={taskslight}
                    imageDark={tasks}
                    left
                />

                <Highlights
                    heading={
                        <span className="inline-flex items-center gap-2 text-[#cb00fb] text-3xl font-bold">
                            Visual Calendar <ChevronRight size={24} strokeWidth={2.2} />
                        </span>
                    }
                    description={`The calendar view gives you a full picture of your month. 
Each day shows how many tasks are due or reminders are scheduled. Click on any date to see details.

It’s a helpful way to spot busy weeks, plan ahead, and stay balanced without scrolling through long lists.`}
                    imageLight={calendarlight}
                    imageDark={calendar}
                />

                <Highlights
                    heading={
                        <span className="inline-flex items-center gap-2 text-[#cb00fb] text-3xl font-bold">
                            Reminder List <ChevronRight size={24} strokeWidth={2.2} />
                        </span>
                    }
                    description={`Reminders are kept separate from tasks so you can see just what’s time-sensitive. 
You can mark them as done or reschedule in one click.

It’s useful for simple things like sending an email, taking a break, or anything you don’t want to forget.`}
                    imageLight={remindersDark}
                    imageDark={reminders}
                    left
                />

                <Highlights
                    heading={
                        <span className="inline-flex items-center gap-2 text-[#cb00fb] text-3xl font-bold">
                            Your Progress <ChevronRight size={24} strokeWidth={2.2} />
                        </span>
                    }
                    description={`The stats page shows how consistent you’ve been with your tasks. 
It tracks what you’ve completed, how many days you’ve stayed active, and gives a simple overview of your week.

You don’t need to do anything extra. Just use the app and the insights build up over time.`}
                    imageLight={statslight}
                    imageDark={stats}
                />
                <Login/>

            </section>
            <footer className="w-full bg-[#9b00bd] py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-white">
                        © {new Date().getFullYear()} Chrono. All rights reserved.
                    </p>
                </div>
            </footer>
        </>

    );
}
