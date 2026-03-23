import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import styles from './Dashboard.module.css'
import { Navbar } from '../components/Navbar'
import { ApplicationDetails } from '../components/ApplicationDetails'
import type { Application, ApplicationForm, ApplicationStats, Status } from '../types/application.types'
import { ApplicationModal } from '../components/ApplicationModal'
import { applicationService } from '../services/application.service'

const statusStyles: Record<Status, string> = {
	Applied: styles.badgeApplied,
	Interview: styles.badgeInterview,
	Offer: styles.badgeOffer,
	Rejected: styles.badgeRejected,
	Ghosted: styles.badgeGhosted,
}

const filters = ['All', 'Applied', 'Interview', 'Offer', 'Rejected', 'Ghosted']
const PAGE_SIZE = 10

const formatDate = (date: string) =>
	new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export default function Dashboard() {
	const { user } = useAuth()
	const [applications, setApplications] = useState<Application[]>([])
	const [activeFilter, setActiveFilter] = useState<string>('All')
	const [selectedApp, setSelectedApp] = useState<Application | null>(null)
	const [modal, setModal] = useState<{ mode: 'add' | 'edit', app?: Application } | null>(null)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const [totalPages, setTotalPages] = useState<number>(1)
	const [total, setTotal] = useState<number>(0)

	const [stats, setStats] = useState<ApplicationStats>({ total: 0, interviews: 0, offers: 0, rejections: 0 })
	const [loading, setLoading] = useState<boolean>(true)

	const MAX_PAGINATION_OPTIONS = 5
	let startPage = Math.max(currentPage - Math.floor(MAX_PAGINATION_OPTIONS / 2), 1)
	let endPage = startPage + MAX_PAGINATION_OPTIONS - 1
	if (endPage > totalPages) {
		endPage = totalPages
		startPage = Math.max(endPage - MAX_PAGINATION_OPTIONS + 1, 1)
	}
	const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

	const fetchData = async () => {
		try {
			const [{ applications, pagination }, stats] = await Promise.all([
				applicationService.getApplications(currentPage, PAGE_SIZE, activeFilter === 'All' ? undefined : activeFilter as Status),
				applicationService.getStats()
			])

			setApplications(applications)
			setTotalPages(pagination.totalPages)
			setTotal(pagination.total)
			setStats(stats)
		} catch (err) {
			console.error(err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [activeFilter, currentPage])

	const handleFilterChange = (f: string) => {
		setActiveFilter(f)
		setCurrentPage(1)
	}

	const handleSubmit = async (data: ApplicationForm) => {
		try {
			if (modal?.mode === 'add') {
				await applicationService.createApplication(data)
			} else if (modal?.mode === 'edit' && modal.app) {
				await applicationService.updateApplication(modal.app.id, data)
			}
			setModal(null)
			setSelectedApp(null)
			fetchData()
		} catch (err) {
			console.error(err)
		}
	}

	const handleDelete = async () => {
		if (!modal?.app) return
		try {
			await applicationService.deleteApplication(modal.app.id)
			setModal(null)
			setSelectedApp(null)
			fetchData()
		} catch (err) {
			console.error(err)
		}
	}

	const greeting = () => {
		const hour = new Date().getHours()
		if (hour < 12) return 'Good morning'
		if (hour < 18) return 'Good afternoon'
		return 'Good evening'
	}

	const statKeys = [
		{ label: 'Total Applied', icon: '📋', color: '#e8f4fd', value: stats.total },
		{ label: 'Interviews', icon: '📅', color: '#fef3e2', value: stats.interviews },
		{ label: 'Offers', icon: '🎉', color: '#e6f9f0', value: stats.offers },
		{ label: 'Rejected', icon: '❌', color: '#fde8e8', value: stats.rejections },
	]

	if (loading) return (
		<div className={styles.loadingContainer}>
			<div className={styles.dots}>
				<span className={styles.dot} />
				<span className={styles.dot} />
				<span className={styles.dot} />
			</div>
		</div>
	)

	return (
		<div className={styles.container}>
			<Navbar />

			<main className={styles.main}>

				{/* Header */}
				<div className={styles.header}>
					<p className={styles.headerDate}>
						{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
					</p>
					<h1 className={styles.headerTitle}>
						{greeting()}, {user?.name?.split(' ')[0] ?? 'there'} 👋
					</h1>
				</div>

				{/* Stats */}
				<div className={styles.stats}>
					{statKeys.map((stat, i) => {
						return (
							<div key={i} className={styles.statCard}>
								<div className={styles.statIcon} style={{ background: stat.color }}>{stat.icon}</div>
								<p className={styles.statValue}>{stat.value}</p>
								<p className={styles.statLabel}>{stat.label}</p>
							</div>
						)
					})}
				</div>

				{/* Section header */}
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Applications</h2>
					<button className={styles.addBtn} onClick={() => setModal({ mode: 'add' })}>
						+ Add Application
					</button>
				</div>

				{/* Filters */}
				<div className={styles.filters}>
					{filters.map(f => (
						<button
							key={f}
							className={`${styles.filterTab} ${activeFilter === f ? styles.filterTabActive : ''}`}
							onClick={() => handleFilterChange(f)}
						>
							{f}
						</button>
					))}
				</div>

				{/* Table */}
				<div className={styles.tableWrapper}>
					<table className={styles.table}>
						<thead className={styles.tableHead}>
							<tr>
								<th>Company</th>
								<th>Role</th>
								<th>Type</th>
								<th>Applied</th>
								<th>Status</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{applications.map(app => (
								<tr
									key={app.id}
									className={`${styles.tableRow} ${selectedApp?.id === app.id ? styles.tableRowActive : ''}`}
									onClick={() => setSelectedApp(app)}
								>
									<td>
										<div className={styles.companyCell}>
											<div>
												<div className={styles.companyName}>{app.company}</div>
												<div className={styles.companyLocation}>{app.location}</div>
											</div>
										</div>
									</td>
									<td className={styles.roleText}>{app.role}</td>
									<td className={styles.roleText}>{app.type}</td>
									<td className={styles.dateText}>{formatDate(app.date.toString())}</td>
									<td>
										<span className={`${styles.badge} ${statusStyles[app.status]}`}>
											<span className={styles.badgeDot} />
											{app.status}
										</span>
									</td>
									<td>
										<button
											className={styles.actionBtn}
											onClick={e => { e.stopPropagation(); setSelectedApp(app) }}
										>
											View
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{/* Pagination */}
				<div className={styles.pagination}>
					<span className={styles.paginationInfo}>
						Showing {total === 0 ? 0 : Math.min((currentPage - 1) * PAGE_SIZE + 1, total)}–{Math.min(currentPage * PAGE_SIZE, total)} of {total} applications
					</span>
					<div className={styles.paginationControls}>
						<button
							className={styles.pageBtn}
							onClick={() => setCurrentPage(p => p - 1)}
							disabled={currentPage === 1}
						>
							←
						</button>
						{visiblePages.map(p => (
							<button
								key={p}
								className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}
								onClick={() => setCurrentPage(p)}
							>
								{p}
							</button>
						))}
						<button
							className={styles.pageBtn}
							onClick={() => setCurrentPage(p => p + 1)}
							disabled={currentPage === totalPages}
						>
							→
						</button>
					</div>
				</div>
			</main>

			{selectedApp && (
				<ApplicationDetails
					application={selectedApp}
					onClose={() => setSelectedApp(null)}
					onEdit={() => setModal({ mode: 'edit', app: selectedApp })}
				/>
			)}

			{modal && (
				<ApplicationModal
					mode={modal.mode}
					application={modal.app}
					onClose={() => setModal(null)}
					onSubmit={handleSubmit}
					onDelete={handleDelete}
				/>
			)}
		</div>
	)
}